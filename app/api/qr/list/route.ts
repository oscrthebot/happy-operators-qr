import { NextResponse } from 'next/server';
import { getAllQRCodes } from '@/lib/db';

export async function GET() {
  try {
    const qrCodes = await getAllQRCodes();

    return NextResponse.json({
      success: true,
      qrCodes: qrCodes.map(qr => ({
        ...qr,
        trackingUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/c/${qr.short_id}`,
      })),
    });
  } catch (error: any) {
    console.error('List QR codes error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
}
