import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { StatusTypes } from "./schema";

const CONFIDENCE_THRESHOLD = 0.75;

function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|corp|co|team|the|recruiting|talent)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export const reconcileClassification = internalMutation({
  args: {
    userId: v.id("users"),
    // From the classifier
    isApplicationEmail: v.boolean(),
    role: v.string(),
    company: v.string(),
    status: v.union(StatusTypes, v.null()),
    confidence: v.number(),
    // Email context for the review queue and notifications
    emailSubject: v.string(),
    emailSnippet: v.string(),
    emailFrom: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Do nothing if this is not an application email
    if (!args.isApplicationEmail || args.status === null) {
      return { outcome: "ignored" as const };
    }

    // Find user's application corresponding to this email
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const target = normalizeCompanyName(args.company);
    const matches = apps.filter(
      (a) => normalizeCompanyName(a.company) === target,
    );

    // Low confidence or ambiguous matches go to review queue
    const low_confidence = args.confidence < CONFIDENCE_THRESHOLD;
    const ambiguous = matches.length !== 1;
    if (low_confidence || ambiguous) {
      await ctx.db.insert("reviewQueue", {
        userId,
        emailFrom: args.emailFrom,
        emailSnippet: args.emailSnippet,
        emailSubject: args.emailSubject,
        proposedRole: args.role,
        proposedCompany: args.company,
        proposedStatus: args.status,
        confidence: args.confidence,
        matchedApplicationId: matches.length === 1 ? matches[0]._id : undefined,
        state: "pending",
        createdAt: Date.now(),
      });
      return { outcome: "queued" as const };
    }

    // Auto-update and notify high confidence scores
    const app = matches[0];

    if (args.status === app.status) {
      return { outcome: "no_change" as const };
    }

    await ctx.db.patch(app._id, {
      status: args.status,
      lastUpdate: Date.now(),
      autoUpdated: true,
    });

    await ctx.db.insert("notifications", {
      userId,
      applicationId: app._id,
      message: `${app.company} moved to ${args.status.replace("_", " ")}`,
      read: false,
      createdAt: Date.now(),
    });

    return { outcome: "updated" as const, applicationId: app._id };
  },
});
