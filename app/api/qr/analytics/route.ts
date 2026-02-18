import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const qrId = searchParams.get('qrId');

    if (!qrId) {
      return NextResponse.json(
        { error: 'QR ID is required' },
        { status: 400 }
      );
    }

    const analytics = await convex.query(api.qrCodes.getAnalytics, {
      id: qrId as Id<"qrCodes">,
    });

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
