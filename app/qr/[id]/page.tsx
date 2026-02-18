'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import AnalyticsChart from '@/components/AnalyticsChart';

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

interface Analytics {
  date: string;
  clicks: number;
}

export default function QRAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load QR code
        const qrRes = await fetch('/api/qr/list');
        const qrData = await qrRes.json();
        if (qrData.success) {
          const qr = qrData.qrCodes.find((q: QRCode) => q.id === parseInt(id));
          setQrCode(qr);
        }

        // Load analytics
        const analyticsRes = await fetch(`/api/qr/analytics?qrId=${id}&days=${days}`);
        const analyticsData = await analyticsRes.json();
        if (analyticsData.success) {
          setAnalytics(analyticsData.analytics);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">QR Code not found</p>
        <Link href="/" className="text-primary hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const totalClicks = analytics.reduce((sum, day) => sum + parseInt(day.clicks.toString()), 0);

  return (
    <div>
      <Link href="/" className="text-primary hover:underline mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{qrCode.name}</h2>
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-medium">Target:</span> {qrCode.target_url}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Tracking URL:</span>{' '}
              <a
                href={qrCode.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {qrCode.trackingUrl}
              </a>
            </p>
          </div>

          <img
            src={qrCode.qr_data_url}
            alt={qrCode.name}
            className="w-32 h-32 border-2 border-gray-200 rounded ml-4"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Click Analytics</h3>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Clicks</p>
            <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Days Active</p>
            <p className="text-3xl font-bold text-gray-900">
              {Math.ceil(
                (new Date().getTime() - new Date(qrCode.created_at).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Avg Clicks/Day</p>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.length > 0
                ? (totalClicks / analytics.length).toFixed(1)
                : '0'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Peak Day</p>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.length > 0
                ? Math.max(...analytics.map((a) => parseInt(a.clicks.toString())))
                : '0'}
            </p>
          </div>
        </div>

        {analytics.length > 0 ? (
          <AnalyticsChart data={analytics} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            No clicks yet. Share your QR code to start tracking!
          </div>
        )}
      </div>
    </div>
  );
}
