import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'QR code ID is required' },
        { status: 400 }
      );
    }

    await convex.mutation(api.qrCodes.deleteQRCode, {
      id: id as Id<"qrCodes">,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete QR code error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete QR code' },
      { status: 500 }
    );
  }
}
