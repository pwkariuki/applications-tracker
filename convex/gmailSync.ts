import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { classifyEmailContent } from "./classify";

// Processed email helpers
export const wasProcessed = internalQuery({
  args: {
    userId: v.id("users"),
    gmailMessageId: v.string(),
  },
  handler: async (ctx, { userId, gmailMessageId }) => {
    const row = await ctx.db
      .query("processedEmails")
      .withIndex("by_user_and_message", (q) =>
        q.eq("userId", userId).eq("gmailMessageId", gmailMessageId),
      )
      .first();
    return row !== null;
  },
});

export const markProcessed = internalMutation({
  args: {
    userId: v.id("users"),
    gmailMessageId: v.string(),
  },
  handler: async (ctx, { userId, gmailMessageId }) => {
    await ctx.db.insert("processedEmails", {
      userId,
      gmailMessageId,
      processedAt: Date.now(),
    });
  },
});

// Sync one user
export const runEmailSync = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const summary = { updated: 0, queued: 0, ignored: 0, skipped: 0 };
    const emails = await ctx.runAction(internal.gmailFetch.fetchRecentEmails, {
      userId,
    });

    for (const email of emails) {
      // skip anything previously handled
      const processed = await ctx.runQuery(internal.gmailSync.wasProcessed, {
        userId,
        gmailMessageId: email.id,
      });
      if (processed) {
        summary.skipped++;
        continue;
      }

      // classify
      let result;
      try {
        result = await classifyEmailContent({
          subject: email.subject,
          body: email.body,
          from: email.from,
        });
      } catch {
        continue; // don't abort the whole run
      }

      // reconcile (auto-update or add to review queue)
      const outcome = await ctx.runMutation(
        internal.reconcile.reconcileClassification,
        {
          userId,
          isApplicationEmail: result.isApplicationEmail,
          role: result.role,
          company: result.company,
          status: result.status,
          confidence: result.confidence,
          emailSubject: email.subject,
          emailSnippet: email.body.slice(0, 200),
          emailFrom: email.from,
        },
      );

      if (outcome.outcome === "updated") {
        summary.updated++;
      } else if (outcome.outcome === "queued") {
        summary.queued++;
      } else {
        summary.ignored++;
      }

      // mark as handles so re-runs don't re-process it
      await ctx.runMutation(internal.gmailSync.markProcessed, {
        userId,
        gmailMessageId: email.id,
      });
    }

    return summary;
  },
});

// Cron entry point – sync every connected user
export const listConnectedUserIds = internalQuery({
  args: {},
  handler: async (ctx) => {
    const tokens = await ctx.db.query("gmailTokens").collect();
    return tokens.map((t) => t.userId);
  },
});

export const runSyncForAllUsers = internalAction({
  args: {},
  handler: async (ctx) => {
    const userIds = await ctx.runQuery(
      internal.gmailSync.listConnectedUserIds,
      {},
    );
    for (const userId of userIds) {
      try {
        await ctx.runAction(internal.gmailSync.runEmailSync, { userId });
      } catch (e) {
        // one user's failure (e.g. expired refresh token) shouldn't stop others.
        console.error(`Sync failed for user ${userId}:`, e);
      }
    }
  },
});
