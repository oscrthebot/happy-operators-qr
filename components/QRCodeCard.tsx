'use client';

import Link from 'next/link';
import { useState } from 'react';

interface QRCodeCardProps {
  qrCode: {
    id: number;
    short_id: string;
    name: string;
    target_url: string;
    qr_data_url: string;
    created_at: string;
    click_count: number;
    trackingUrl: string;
  };
  onDelete?: () => void;
}

export default function QRCodeCard({ qrCode, onDelete }: QRCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode.qr_data_url;
    link.download = `${qrCode.name.replace(/\s+/g, '-')}.png`;
    link.click();
  };

  const copyTrackingUrl = async () => {
    await navigator.clipboard.writeText(qrCode.trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${qrCode.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/qr/delete?id=${qrCode.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (onDelete) onDelete();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete QR code');
      }
    } catch (error) {
      alert('Failed to delete QR code');
      console.error(error);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors">
      {/* QR Code Image */}
      <div className="flex justify-center mb-4">
        <img
          src={qrCode.qr_data_url}
          alt={qrCode.name}
          className="w-40 h-40 border border-neutral-200 rounded-lg"
        />
      </div>

      {/* Info */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-neutral-900 mb-2">{qrCode.name}</h3>
        
        <div className="text-sm text-neutral-600 space-y-1">
          <p className="truncate text-xs">
            <span className="font-medium text-neutral-700">Target:</span>{' '}
            <span className="text-neutral-500">{qrCode.target_url}</span>
          </p>
          <div className="flex items-center justify-between text-xs">
            <span>
              <span className="font-medium text-neutral-700">Clicks:</span>{' '}
              <span className="text-neutral-900 font-semibold">{qrCode.click_count || 0}</span>
            </span>
            <span className="text-neutral-400">
              {new Date(qrCode.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={downloadQR}
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            title="Download PNG"
          >
            ⬇️ Download
          </button>

          <button
            onClick={copyTrackingUrl}
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            title="Copy tracking URL"
          >
            {copied ? '✓ Copied!' : '📋 Copy URL'}
          </button>
        </div>

        <Link
          href={`/qr/${qrCode.id}`}
          className="block w-full bg-primary hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
        >
          📊 View Analytics
        </Link>

        <button
          onClick={handleDelete}
          className="w-full bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
