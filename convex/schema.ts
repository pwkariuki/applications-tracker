import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const StatusTypes = v.union(
  v.literal("applied"),
  v.literal("phone_screen"),
  v.literal("technical"),
  v.literal("onsite"),
  v.literal("offer"),
  v.literal("signed"),
  v.literal("rejected"),
  v.literal("withdrawn"),
);

export default defineSchema({
  ...authTables,

  applications: defineTable({
    userId: v.id("users"),
    company: v.string(),
    role: v.string(),
    status: StatusTypes,
    source: v.string(),
    notes: v.optional(v.string()),
    lastUpdate: v.number(),
    autoUpdated: v.boolean(),
  }).index("by_user", ["userId"]),
});
