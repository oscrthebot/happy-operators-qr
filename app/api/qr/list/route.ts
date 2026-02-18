import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const qrCodes = await convex.query(api.qrCodes.list);
    return NextResponse.json({ success: true, qrCodes });
  } catch (error: any) {
    console.error('List QR codes error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
}
