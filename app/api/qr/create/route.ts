import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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

    // Save to Convex
    const qrCode = await convex.mutation(api.qrCodes.create, {
      name,
      targetUrl,
      shortId,
      qrDataUrl,
    });

    if (!qrCode) {
      return NextResponse.json(
        { error: 'Failed to create QR code' },
        { status: 500 }
      );
    }

    // Transform to match frontend expectations
    return NextResponse.json({
      success: true,
      qrCode: {
        id: qrCode._id,
        short_id: qrCode.shortId,
        name: qrCode.name,
        target_url: qrCode.targetUrl,
        qr_data_url: qrCode.qrDataUrl,
        created_at: new Date(qrCode.createdAt).toISOString(),
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
