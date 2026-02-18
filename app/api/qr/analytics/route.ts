import { NextRequest, NextResponse } from 'next/server';
import { getQRAnalytics } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const qrId = searchParams.get('qrId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!qrId) {
      return NextResponse.json(
        { error: 'QR ID is required' },
        { status: 400 }
      );
    }

    const analytics = await getQRAnalytics(parseInt(qrId), days);

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
