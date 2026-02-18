import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import crypto from 'crypto';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params;
    
    // Track click and get target URL
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Hash IP for privacy
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    const result = await convex.mutation(api.qrCodes.recordClick, {
      shortId,
      userAgent,
      ipHash,
    });

    // Redirect to target URL
    return NextResponse.redirect(result.targetUrl);
  } catch (error: any) {
    console.error('Click tracking error:', error);
    return NextResponse.json(
      { error: 'QR code not found or tracking failed' },
      { status: 404 }
    );
  }
}
