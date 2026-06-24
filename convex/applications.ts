import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { StatusTypes } from "./schema";

// Read all applications, newest first
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("applications").order("desc").collect();
  },
});

// Read single application by id
export const get = query({
  args: {
    id: v.id("applications"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new application, status defaults to applied
export const create = mutation({
  args: {
    company: v.string(),
    role: v.string(),
    status: v.optional(StatusTypes),
    source: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", {
      company: args.company,
      role: args.role,
      status: args.status ?? "applied",
      source: args.source,
      notes: args.notes ?? "",
      lastUpdate: Date.now(),
      autoUpdated: false,
    });
  },
});

// Update other fields other than status
export const update = mutation({
  args: {
    id: v.id("applications"),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Application not found");
    }

    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    );

    await ctx.db.patch(id, patch);
  },
});

// Update status (to be used by cron jobs)
export const updateStatus = mutation({
  args: {
    id: v.id("applications"),
    status: StatusTypes,
    auto: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Application not found");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      lastUpdate: Date.now(),
      autoUpdated: args.auto ?? false,
    });
  },
});

// Update notes
export const updateNotes = mutation({
  args: {
    id: v.id("applications"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Application not found");
    }

    await ctx.db.patch(args.id, {
      notes: args.notes,
    });
  },
});

// Delete an application by id
export const remove = mutation({
  args: {
    id: v.id("applications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
