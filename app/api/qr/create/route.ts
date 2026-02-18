import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { createQRCode } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, targetUrl } = await req.json();

    if (!name || !targetUrl) {
      return NextResponse.json(
        { error: 'Name and target URL are required' },
        { status: 400 }
      );
    }

    // Generate short ID
    const shortId = nanoid(6);

    // Generate tracking URL
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/c/${shortId}`;

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Save to database
    const qrCode = await createQRCode(shortId, name, targetUrl, qrDataUrl);

    return NextResponse.json({
      success: true,
      qrCode: {
        ...qrCode,
        trackingUrl,
      },
    });
  } catch (error: any) {
    console.error('QR creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create QR code' },
      { status: 500 }
    );
  }
}
