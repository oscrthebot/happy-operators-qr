import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  qrCodes: defineTable({
    name: v.string(),
    targetUrl: v.string(),
    shortId: v.string(),
    qrDataUrl: v.string(),
    createdAt: v.number(),
  }).index("by_shortId", ["shortId"]),

  clicks: defineTable({
    qrCodeId: v.id("qrCodes"),
    timestamp: v.number(),
    userAgent: v.optional(v.string()),
    ipHash: v.optional(v.string()),
  }).index("by_qrCode", ["qrCodeId"]),
});
