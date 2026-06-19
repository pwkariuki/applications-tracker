import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const insertSeedData = internalMutation({
  args: {
    applications: v.array(
      v.object({
        autoUpdated: v.boolean(),
        company: v.string(),
        lastUpdate: v.float64(),
        notes: v.string(),
        role: v.string(),
        source: v.string(),
        status: v.union(
          v.literal("applied"),
          v.literal("phone_screen"),
          v.literal("technical"),
          v.literal("onsite"),
          v.literal("offer"),
          v.literal("signed"),
          v.literal("rejected"),
          v.literal("withdrawn"),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const application of args.applications) {
      await ctx.db.insert("applications", {
        ...application
      })
    }
  },
});
