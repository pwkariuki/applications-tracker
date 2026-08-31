import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

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
