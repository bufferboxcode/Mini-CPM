import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ────────────────────────────────────────────────────────────────

/** โหลด projects ทั้งหมดใน workspace */
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .collect();
  },
});

/** โหลด projects ทั้งหมด (ใช้ตอน initial load หลัง refresh) */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

// ── Mutations ──────────────────────────────────────────────────────────────

/**
 * สร้าง Project ใหม่
 * Form fields → DB columns:
 *   pjName     → name
 *   pjApproval → approvalNo
 *   pjControl  → controlPerson
 *   pjPhone    → phone
 *   pjStart    → startDate  (ISO date string "YYYY-MM-DD" → Unix ms)
 *   pjRef      → budgetRef
 *   pjDiv      → division
 *   pjBudget   → totalBudget
 *   (status default "pending")
 */
export const create = mutation({
  args: {
    workspaceId:   v.id("workspaces"),
    name:          v.string(),
    approvalNo:    v.string(),
    controlPerson: v.string(),
    phone:         v.string(),
    startDate:     v.number(),   // Unix ms — แปลงจาก "YYYY-MM-DD" ก่อน save
    budgetRef:     v.string(),
    division:      v.string(),
    totalBudget:   v.number(),
    status:        v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * แก้ไข Project
 * Form fields เหมือน create แต่ทุก field เป็น optional
 */
export const update = mutation({
  args: {
    id:            v.id("projects"),
    name:          v.optional(v.string()),
    approvalNo:    v.optional(v.string()),
    controlPerson: v.optional(v.string()),
    phone:         v.optional(v.string()),
    startDate:     v.optional(v.number()),
    budgetRef:     v.optional(v.string()),
    division:      v.optional(v.string()),
    totalBudget:   v.optional(v.number()),
    status:        v.optional(v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled"),
    )),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
  },
});

/**
 * ลบ Project (cascade ลบ budgetCats + transactions ที่เกี่ยวข้อง)
 */
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    // cascade delete budgetCats + transactions
    const cats = await ctx.db
      .query("budgetCats")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect();
    for (const cat of cats) {
      const txs = await ctx.db
        .query("transactions")
        .withIndex("by_budgetCat", (q) => q.eq("budgetCatId", cat._id))
        .collect();
      for (const tx of txs) await ctx.db.delete(tx._id);
      await ctx.db.delete(cat._id);
    }
    // cascade delete divisions
    const divs = await ctx.db
      .query("divisions")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect();
    for (const d of divs) await ctx.db.delete(d._id);

    await ctx.db.delete(id);
  },
});
