'use client';

import { useEffect, useState } from 'react';
import { Plus, QrCode as QrCodeIcon, CursorClick, ChartLine, X } from 'phosphor-react';
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
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 dark:border-neutral-700 border-t-primary"></div>
      </div>
    );
  }

  const totalClicks = qrCodes.reduce((sum, qr) => sum + (qr.click_count || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Manage and track your QR codes</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <QrCodeIcon size={16} />
            <div className="text-sm font-medium">Total QR Codes</div>
          </div>
          <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{qrCodes.length}</div>
        </div>
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <CursorClick size={16} />
            <div className="text-sm font-medium">Total Clicks</div>
          </div>
          <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{totalClicks}</div>
        </div>
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-1">
            <ChartLine size={16} />
            <div className="text-sm font-medium">Avg. Clicks</div>
          </div>
          <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {qrCodes.length > 0 ? Math.round(totalClicks / qrCodes.length) : 0}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">QR Codes</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2"
        >
          {showCreateForm ? (
            <>
              <X size={16} weight="bold" />
              Cancel
            </>
          ) : (
            <>
              <Plus size={16} weight="bold" />
              Create New
            </>
          )}
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
        <div className="text-center py-16 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <QrCodeIcon size={64} className="mx-auto mb-4 text-neutral-400" />
          <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-4">No QR codes yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-primary hover:underline font-medium inline-flex items-center gap-2"
          >
            <Plus size={16} />
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
