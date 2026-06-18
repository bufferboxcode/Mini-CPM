import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ─────────────────────────────────────────────────────────────────────────────
// MiniCPM — Convex Database Schema
//
// Entity hierarchy:
//   users  →  workspaceMembers  →  workspaces
//                                      └─ projects
//                                             ├─ divisions
//                                             └─ budgetCats
//                                                    └─ transactions
// ─────────────────────────────────────────────────────────────────────────────

export default defineSchema({

  // ── Users ──────────────────────────────────────────────────────────────────
  // สร้างโดย Convex Auth (เช่น Clerk / Auth0) หรือ custom auth
  // _id ใช้เป็น userId ทั่วทั้งระบบ
  users: defineTable({
    name:      v.string(),               // ชื่อ-นามสกุล
    email:     v.string(),               // อีเมล (unique)
    avatarUrl: v.optional(v.string()),   // รูปโปรไฟล์
    createdAt: v.number(),               // Unix ms
  })
    .index("by_email", ["email"]),

  // ── Workspaces ─────────────────────────────────────────────────────────────
  // "งบประมาณ 2568" — กลุ่มโครงการในปีงบประมาณเดียวกัน
  workspaces: defineTable({
    name:        v.string(),   // เช่น "งบประมาณ 2568"
    year:        v.number(),   // ปี พ.ศ. เช่น 2568
    dept:        v.string(),   // หน่วยงาน เช่น "กฟภ. สาขาย่อย เขต 1"
    totalBudget: v.number(),   // งบประมาณรวมของ workspace (บาท)
    createdBy:   v.optional(v.id("users")),
    createdAt:   v.number(),
    updatedAt:   v.number(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_year",      ["year"]),

  // ── Workspace Members ──────────────────────────────────────────────────────
  // ตาราง junction สำหรับ multi-user / shared workspace
  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId:      v.id("users"),
    role:        v.union(
      v.literal("owner"),    // สร้าง workspace / จัดการ member
      v.literal("editor"),   // เพิ่ม/แก้ไข/ลบ project และข้อมูลภายใน
      v.literal("viewer"),   // ดูได้อย่างเดียว
    ),
    joinedAt:    v.number(),
  })
    .index("by_workspace",      ["workspaceId"])
    .index("by_user",           ["userId"])
    .index("by_workspace_user", ["workspaceId", "userId"]),

  // ── Projects ───────────────────────────────────────────────────────────────
  // "แฟ้มงาน" — โครงการก่อสร้างแต่ละงาน
  projects: defineTable({
    workspaceId:   v.id("workspaces"),
    name:          v.string(),    // ชื่องาน เช่น "งาน กฟร.99 สาย 6 หาง ศรีวิไล"
    approvalNo:    v.string(),    // เลขที่อนุมัติ เช่น "ศก(333) 66/69"
    budgetRef:     v.string(),    // หมายเลขงาน/หนังสืออ้างอิง เช่น "C-69-B-TAK-CS-7009.01.9"
    division:      v.string(),    // แผนก/แมก เช่น "103ช่"
    controlPerson: v.string(),    // ผู้ควบคุมงาน (พง.)
    phone:         v.string(),    // เบอร์โทรติดต่อ
    startDate:     v.number(),    // วันที่เริ่มงาน (Unix ms) — เปลี่ยนจาก string
    totalBudget:   v.number(),    // งบประมาณรวมของโครงการ (บาท)
    status:        v.union(
      v.literal("pending"),       // รอดำเนินการ
      v.literal("active"),        // กำลังดำเนินการ
      v.literal("completed"),     // เสร็จสมบูรณ์
      v.literal("cancelled"),     // ยกเลิก
    ),
    createdBy:     v.optional(v.id("users")),
    createdAt:     v.number(),
    updatedAt:     v.number(),
  })
    .index("by_workspace",        ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "status"])
    .index("by_createdBy",        ["createdBy"]),

  // ── Divisions ──────────────────────────────────────────────────────────────
  // "แผนก" ภายในโครงการ เช่น HT-C-E, LT-C-E, TR-C-E
  divisions: defineTable({
    projectId:   v.id("projects"),
    code:        v.string(),   // รหัสแผนก เช่น "HT-C-E"
    networkCode: v.string(),   // รหัสเครือข่าย เช่น "8005204581"
    desc:        v.string(),   // คำอธิบาย เช่น "แรงสูง-โยธา-ไฟฟ้า"
    createdAt:   v.number(),
  })
    .index("by_project", ["projectId"]),

  // ── Budget Categories ──────────────────────────────────────────────────────
  // ประเภทงบในแต่ละโครงการ: ค่าแรง / ค่าควบคุม / ค่าขนส่ง / เบ็ดเตล็ด
  budgetCats: defineTable({
    projectId:  v.id("projects"),
    divisionId: v.optional(v.id("divisions")),  // เชื่อมกับแผนก (ถ้ามี)
    cat:        v.union(
      v.literal("labor"),        // ค่าแรง
      v.literal("supervision"),  // ค่าควบคุม
      v.literal("transport"),    // ค่าขนส่ง
      v.literal("misc"),         // เบ็ดเตล็ด
    ),
    name:       v.string(),    // ชื่อที่กำหนดเอง เช่น "ค่าแรงรวม"
    allocTotal: v.number(),    // งบจัดสรรรวม (บาท)
    usagePct:   v.number(),    // สัดส่วนการใช้งบ: 80 หรือ 100 (%)
    // allocUsable = allocTotal * usagePct / 100  — คำนวณ client-side
    createdAt:  v.number(),
    updatedAt:  v.number(),
  })
    .index("by_project",  ["projectId"])
    .index("by_division", ["divisionId"]),

  // ── Transactions ───────────────────────────────────────────────────────────
  // รายการเบิกจ่ายในแต่ละ budgetCat
  transactions: defineTable({
    budgetCatId: v.id("budgetCats"),
    projectId:   v.id("projects"),   // denormalized เพื่อ query เร็ว
    desc:        v.string(),          // รายละเอียด เช่น "เบิกค่าแรง งวด 1"
    amount:      v.number(),          // จำนวนเงิน (บาท)
    date:        v.number(),          // วันที่เบิกจ่าย (Unix ms)
    createdBy:   v.optional(v.id("users")),
    createdAt:   v.number(),
    updatedAt:   v.number(),
  })
    .index("by_budgetCat", ["budgetCatId"])
    .index("by_project",   ["projectId"])
    .index("by_date",      ["date"]),

});
