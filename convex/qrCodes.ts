// @ts-nocheck
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new QR code
export const create = mutation({
  args: {
    name: v.string(),
    targetUrl: v.string(),
    shortId: v.string(),
    qrDataUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const qrCodeId = await ctx.db.insert("qrCodes", {
      name: args.name,
      targetUrl: args.targetUrl,
      shortId: args.shortId,
      qrDataUrl: args.qrDataUrl,
      createdAt: Date.now(),
    });
    
    const qrCode = await ctx.db.get(qrCodeId);
    return qrCode;
  },
});

// List all QR codes
export const list = query({
  handler: async (ctx) => {
    const qrCodes = await ctx.db.query("qrCodes").order("desc").collect();
    
    // Get click counts for each QR code
    const qrCodesWithCounts = await Promise.all(
      qrCodes.map(async (qr) => {
        const clicks = await ctx.db
          .query("clicks")
          .withIndex("by_qrCode", (q) => q.eq("qrCodeId", qr._id))
          .collect();
        
        return {
          ...qr,
          clickCount: clicks.length,
        };
      })
    );
    
    return qrCodesWithCounts;
  },
});

// Get QR code by short ID
export const getByShortId = query({
  args: { shortId: v.string() },
  handler: async (ctx, args) => {
    const qrCode = await ctx.db
      .query("qrCodes")
      .withIndex("by_shortId", (q) => q.eq("shortId", args.shortId))
      .first();
    
    return qrCode;
  },
});

// Get QR code by ID
export const getById = query({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get analytics for a QR code
export const getAnalytics = query({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    const qrCode = await ctx.db.get(args.id);
    if (!qrCode) {
      throw new Error("QR code not found");
    }

    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_qrCode", (q) => q.eq("qrCodeId", args.id))
      .collect();

    // Group clicks by day
    const clicksByDay: Record<string, number> = {};
    clicks.forEach((click) => {
      const date = new Date(click.timestamp).toISOString().split("T")[0];
      clicksByDay[date] = (clicksByDay[date] || 0) + 1;
    });

    // Convert to array for charting
    const dailyClicks = Object.entries(clicksByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      qrCode,
      totalClicks: clicks.length,
      dailyClicks,
      recentClicks: clicks.slice(-10).reverse(),
    };
  },
});

// Record a click
export const recordClick = mutation({
  args: {
    shortId: v.string(),
    userAgent: v.optional(v.string()),
    ipHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const qrCode = await ctx.db
      .query("qrCodes")
      .withIndex("by_shortId", (q) => q.eq("shortId", args.shortId))
      .first();

    if (!qrCode) {
      throw new Error("QR code not found");
    }

    await ctx.db.insert("clicks", {
      qrCodeId: qrCode._id,
      timestamp: Date.now(),
      userAgent: args.userAgent,
      ipHash: args.ipHash,
    });

    return { targetUrl: qrCode.targetUrl };
  },
});

// Delete a QR code
export const deleteQRCode = mutation({
  args: {
    id: v.id("qrCodes"),
  },
  handler: async (ctx, args) => {
    // Delete all clicks associated with this QR code
    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_qrCode", (q) => q.eq("qrCodeId", args.id))
      .collect();
    
    for (const click of clicks) {
      await ctx.db.delete(click._id);
    }
    
    // Delete the QR code
    await ctx.db.delete(args.id);
    
    return { success: true };
  },
});
