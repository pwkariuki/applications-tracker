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

  // Per-user Gmail auth tokens
  gmailTokens: defineTable({
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(), // Unix ms; refresh once we pass it
    email: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Gmail message IDs already handled
  processedEmails: defineTable({
    userId: v.id("users"),
    gmailMessageId: v.string(),
    processedAt: v.number(),
  }).index("by_user_and_message", ["userId", "gmailMessageId"]),

  // In-app notifications
  notifications: defineTable({
    userId: v.id("users"),
    applicationId: v.optional(v.id("applications")),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Low-confidence or unmatched classifications, awaiting approve/reject.
  reviewQueue: defineTable({
    userId: v.id("users"),
    emailSubject: v.string(),
    emailSnippet: v.string(),
    emailFrom: v.optional(v.string()),
    proposedCompany: v.string(),
    proposedStatus: StatusTypes,
    confidence: v.number(),
    matchedApplicationId: v.optional(v.id("applications")),
    state: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
  }).index("by_user_and_state", ["userId", "state"]),
});
