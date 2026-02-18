'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DownloadSimple, Copy, ChartBar, Trash, Check } from 'phosphor-react';

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
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      {/* QR Code Image */}
      <div className="flex justify-center mb-4">
        <img
          src={qrCode.qr_data_url}
          alt={qrCode.name}
          className="w-40 h-40 border border-neutral-200 dark:border-neutral-700 rounded-lg"
        />
      </div>

      {/* Info */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{qrCode.name}</h3>
        
        <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
          <p className="truncate text-xs">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Target:</span>{' '}
            <span className="text-neutral-500 dark:text-neutral-400">{qrCode.target_url}</span>
          </p>
          <div className="flex items-center justify-between text-xs">
            <span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Clicks:</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{qrCode.click_count || 0}</span>
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">
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
            className="flex-1 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
            title="Download PNG"
          >
            <DownloadSimple size={16} weight="bold" />
            Download
          </button>

          <button
            onClick={copyTrackingUrl}
            className="flex-1 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
            title="Copy tracking URL"
          >
            {copied ? (
              <>
                <Check size={16} weight="bold" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} weight="bold" />
                Copy URL
              </>
            )}
          </button>
        </div>

        <Link
          href={`/qr/${qrCode.id}`}
          className="block w-full bg-primary hover:bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center inline-flex items-center justify-center gap-2"
        >
          <ChartBar size={16} weight="bold" />
          View Analytics
        </Link>

        <button
          onClick={handleDelete}
          className="w-full bg-white dark:bg-neutral-950 hover:bg-red-50 dark:hover:bg-red-950/30 border border-neutral-200 dark:border-neutral-800 hover:border-red-300 dark:hover:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
        >
          <Trash size={16} weight="bold" />
          Delete
        </button>
      </div>
    </div>
  );
}
