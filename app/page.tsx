'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCodeCard from '@/components/QRCodeCard';
import CreateQRForm from '@/components/CreateQRForm';

interface QRCode {
  id: number;
  short_id: string;
  name: string;
  target_url: string;
  qr_data_url: string;
  created_at: string;
  click_count: number;
  trackingUrl: string;
}

export default function Home() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadQRCodes = async () => {
    try {
      const res = await fetch('/api/qr/list');
      const data = await res.json();
      if (data.success) {
        setQrCodes(data.qrCodes);
      }
    } catch (error) {
      console.error('Failed to load QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQRCodes();
  }, []);

  const handleQRCreated = () => {
    setShowCreateForm(false);
    loadQRCodes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 border-t-primary"></div>
      </div>
    );
  }

  const totalClicks = qrCodes.reduce((sum, qr) => sum + (qr.click_count || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Manage and track your QR codes</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <div className="text-sm font-medium text-neutral-600 mb-1">Total QR Codes</div>
          <div className="text-3xl font-semibold text-neutral-900">{qrCodes.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <div className="text-sm font-medium text-neutral-600 mb-1">Total Clicks</div>
          <div className="text-3xl font-semibold text-neutral-900">{totalClicks}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <div className="text-sm font-medium text-neutral-600 mb-1">Avg. Clicks</div>
          <div className="text-3xl font-semibold text-neutral-900">
            {qrCodes.length > 0 ? Math.round(totalClicks / qrCodes.length) : 0}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">QR Codes</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          {showCreateForm ? 'Cancel' : '+ Create New'}
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="mb-6">
          <CreateQRForm onSuccess={handleQRCreated} />
        </div>
      )}

      {/* QR Code grid */}
      {qrCodes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-neutral-600 text-lg mb-4">No QR codes yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-primary hover:underline font-medium"
          >
            Create your first QR code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qrCodes.map((qr) => (
            <QRCodeCard key={qr.id} qrCode={qr} onDelete={loadQRCodes} />
          ))}
        </div>
      )}
    </div>
  );
}
