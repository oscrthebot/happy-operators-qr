import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import crypto from 'crypto';

// Create Convex client - ensure URL is set
const getConvexClient = () => {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
  }
  return new ConvexHttpClient(url);
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params;
    console.log('[Click Tracking] Processing click for shortId:', shortId);
    
    // Get client info
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    // Hash IP for privacy
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    
    console.log('[Click Tracking] User Agent:', userAgent);
    console.log('[Click Tracking] IP Hash:', ipHash.substring(0, 8) + '...');

    // Initialize Convex client
    const convex = getConvexClient();

    // Record click and get target URL
    const result = await convex.mutation(api.qrCodes.recordClick, {
      shortId,
      userAgent,
      ipHash,
    });

    console.log('[Click Tracking] Successfully recorded click, redirecting to:', result.targetUrl);

    // Ensure URL is absolute
    const targetUrl = result.targetUrl.startsWith('http') 
      ? result.targetUrl 
      : `https://${result.targetUrl}`;

    // Redirect to target URL
    return NextResponse.redirect(targetUrl, 307); // 307 preserves method
  } catch (error: any) {
    console.error('[Click Tracking] Error:', error);
    console.error('[Click Tracking] Error details:', {
      message: error.message,
      stack: error.stack,
    });
    
    // Return a more helpful error page
    return new NextResponse(
      `<html>
        <head><title>QR Code Error</title></head>
        <body style="font-family: system-ui; padding: 2rem; max-width: 600px; margin: 0 auto;">
          <h1>QR Code Not Found</h1>
          <p>This QR code does not exist or has been deleted.</p>
          <p style="color: #666; font-size: 0.9em;">Error: ${error.message}</p>
          <a href="/" style="color: #FF6B6B;">← Back to Dashboard</a>
        </body>
      </html>`,
      { 
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}
