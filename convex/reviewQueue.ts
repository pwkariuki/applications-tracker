import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("reviewQueue")
      .withIndex("by_user_and_state", (q) =>
        q.eq("userId", userId).eq("state", "pending"),
      )
      .order("desc")
      .collect();
  },
});

export const pendingCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return 0;
    const pending = await ctx.db
      .query("reviewQueue")
      .withIndex("by_user_and_state", (q) =>
        q.eq("userId", userId).eq("state", "pending"),
      )
      .order("desc")
      .collect();
    return pending.length;
  },
});

// Approve proposed status to the matched application
export const approve = mutation({
  args: { id: v.id("reviewQueue") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const item = await ctx.db.get(id);
    if (!item || item.userId !== userId) throw new Error("Not found");
    if (item.state !== "pending") return; // already handled

    // Resolve application to update. Prefers stored match; otherwise
    // try to match by company as the app may have been added since
    let appId = item.matchedApplicationId ?? null;
    if (appId === null) {
      const apps = await ctx.db
        .query("applications")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
      const match = apps.find(
        (a) => norm(a.company) === norm(item.proposedCompany),
      );
      appId = match?._id ?? null;
    }

    // No application found to approve – create one
    if (appId === null) {
      const newId = await ctx.db.insert("applications", {
        userId,
        company: item.proposedCompany,
        role: "Unknown role",
        status: item.proposedStatus,
        source: "Email",
        notes: "",
        lastUpdate: Date.now(),
        autoUpdated: true,
      });
      await ctx.db.insert("notifications", {
        userId,
        applicationId: newId,
        message: `Added ${item.proposedCompany} (${item.proposedStatus.replace("_", " ")})`,
        read: false,
        createdAt: Date.now(),
      });
      await ctx.db.patch(id, { state: "approved" });
      return { outcome: "created" as const, applicationId: newId };
    }

    // Application matched – update
    const app = await ctx.db.get(appId);
    if (!app || app.userId !== userId) {
      await ctx.db.patch(id, { state: "approved" });
      return { outcome: "no_application" as const };
    }

    // Apply the status, unless it's already applied
    if (app.status !== item.proposedStatus) {
      await ctx.db.patch(appId, {
        status: item.proposedStatus,
        lastUpdate: Date.now(),
        autoUpdated: true,
      });
      await ctx.db.insert("notifications", {
        userId,
        applicationId: appId,
        message: `${app.company} moved to ${item.proposedStatus.replace("_", " ")}`,
        read: false,
        createdAt: Date.now(),
      });
    }

    await ctx.db.patch(id, { state: "approved" });
    return { outcome: "applied" as const, applicationId: appId };
  },
});

// No application should be updated
export const dismiss = mutation({
  args: { id: v.id("reviewQueue") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const item = await ctx.db.get(id);
    if (!item || item.userId !== userId) throw new Error("Not found");
    if (item.state !== "pending") return;
    await ctx.db.patch(id, { state: "rejected" });
  },
});
