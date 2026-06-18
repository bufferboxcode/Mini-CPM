import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ────────────────────────────────────────────────────────────────

/** โหลด workspace ทั้งหมด (เรียงล่าสุดก่อน) */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").order("desc").collect();
  },
});

// ── Mutations ──────────────────────────────────────────────────────────────

/**
 * สร้าง Workspace ใหม่
 * Form fields → DB columns:
 *   wsName   → name
 *   wsYear   → year
 *   wsDept   → dept
 *   wsBudget → totalBudget
 */
export const create = mutation({
  args: {
    name:        v.string(),
    year:        v.number(),
    dept:        v.string(),
    totalBudget: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("workspaces", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * แก้ไข Workspace
 * ใช้ _id ของ Convex (เก็บใน local state ว่า _convexId)
 */
export const update = mutation({
  args: {
    id:          v.id("workspaces"),
    name:        v.optional(v.string()),
    year:        v.optional(v.number()),
    dept:        v.optional(v.string()),
    totalBudget: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
  },
});

/**
 * ลบ Workspace และ cascade ลบ Projects ภายใน
 */
export const remove = mutation({
  args: { id: v.id("workspaces") },
  handler: async (ctx, { id }) => {
    // cascade delete projects
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", id))
      .collect();
    for (const p of projects) {
      await ctx.db.delete(p._id);
    }
    await ctx.db.delete(id);
  },
});
