'use client';

import Link from 'next/link';
import Image from 'next/image';

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
  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode.qr_data_url;
    link.download = `${qrCode.name.replace(/\s+/g, '-')}.png`;
    link.click();
  };

  const copyTrackingUrl = () => {
    navigator.clipboard.writeText(qrCode.trackingUrl);
    alert('Tracking URL copied!');
  };

  const handleDelete = async () => {
    if (!confirm(`Delete QR code "${qrCode.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/qr/delete?id=${qrCode.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('QR code deleted successfully!');
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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-4">
        <img
          src={qrCode.qr_data_url}
          alt={qrCode.name}
          className="w-48 h-48 border-2 border-gray-200 rounded"
        />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{qrCode.name}</h3>

      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p className="truncate">
          <span className="font-medium">Target:</span> {qrCode.target_url}
        </p>
        <p>
          <span className="font-medium">Clicks:</span> {qrCode.click_count || 0}
        </p>
        <p className="text-xs text-gray-500">
          Created: {new Date(qrCode.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={downloadQR}
          className="w-full bg-secondary hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Download PNG
        </button>

        <button
          onClick={copyTrackingUrl}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Copy Tracking URL
        </button>

        <Link
          href={`/qr/${qrCode.id}`}
          className="block w-full bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
        >
          View Analytics
        </Link>

        <button
          onClick={handleDelete}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
