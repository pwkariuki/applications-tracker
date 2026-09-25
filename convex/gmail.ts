import { getAuthUserId } from "@convex-dev/auth/server";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Check if current user has connected their gmail.
// If so, we return the email that is connected.
export const connectionStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return { connected: false as const };

    const tokens = await ctx.db
      .query("gmailTokens")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!tokens) return { connected: false as const };
    return { connected: true as const, email: tokens.email };
  },
});

// Upsert tokens after successful OAuth exchange.
export const storeTokens = internalMutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("gmailTokens")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        email: args.email,
      });
    } else {
      await ctx.db.insert("gmailTokens", {
        userId,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        email: args.email,
      });
    }
  },
});

// Read the current user's token row (for revoke action).
export const getMyTokenRow = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("gmailTokens")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Delete user's token row
export const deleteTokenRow = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const row = await ctx.db
      .query("gmailTokens")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (row) await ctx.db.delete(row._id);
  },
});

export const disconnect = action({
  args: {},
  handler: async (ctx): Promise<{ ok: boolean }> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const row = await ctx.runQuery(internal.gmail.getMyTokenRow, { userId });

    // Revoke access on Google's side
    if (row?.refreshToken) {
      try {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(row.refreshToken)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          },
        );
      } catch {
        // ignore since we still need to delete our row regardless
      }
    }

    // Delete stored tokens
    await ctx.runMutation(internal.gmail.deleteTokenRow, { userId });
    return { ok: true };
  },
});
