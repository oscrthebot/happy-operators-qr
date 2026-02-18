import { NextRequest, NextResponse } from 'next/server';
import { getQRCodeByShortId, trackClick } from '@/lib/db';
import crypto from 'crypto';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params;
    
    // Get QR code
    const qrCode = await getQRCodeByShortId(shortId);

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    // Track click
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Hash IP for privacy
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    await trackClick(qrCode.id, userAgent, ipHash);

    // Redirect to target URL
    return NextResponse.redirect(qrCode.target_url);
  } catch (error: any) {
    console.error('Click tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
