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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your QR Codes</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {showCreateForm ? 'Cancel' : '+ Create New QR Code'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <CreateQRForm onSuccess={handleQRCreated} />
        </div>
      )}

      {qrCodes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg mb-4">No QR codes yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-primary hover:underline font-semibold"
          >
            Create your first QR code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <QRCodeCard key={qr.id} qrCode={qr} />
          ))}
        </div>
      )}
    </div>
  );
}
