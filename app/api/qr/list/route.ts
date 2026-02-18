import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const qrCodes = await convex.query(api.qrCodes.list);
    
    // Transform Convex data to match frontend expectations
    const transformed = qrCodes.map((qr: any) => ({
      id: qr._id,
      short_id: qr.shortId,
      name: qr.name,
      target_url: qr.targetUrl,
      qr_data_url: qr.qrDataUrl,
      created_at: new Date(qr.createdAt).toISOString(),
      click_count: qr.clickCount,
      trackingUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://happy-operators-qr.vercel.app'}/c/${qr.shortId}`,
    }));
    
    return NextResponse.json({ success: true, qrCodes: transformed });
  } catch (error: any) {
    console.error('List QR codes error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
}
