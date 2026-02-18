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
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 border-t-primary"></div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 text-lg mb-4">QR Code not found</p>
        <Link href="/" className="text-primary hover:underline font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const totalClicks = analytics.reduce((sum, day) => sum + parseInt(day.clicks.toString()), 0);

  return (
    <div>
      <Link href="/" className="text-primary hover:underline mb-6 inline-flex items-center text-sm font-medium">
        ← Back to Dashboard
      </Link>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-3">{qrCode.name}</h1>
            <div className="space-y-2 text-sm">
              <p className="text-neutral-600">
                <span className="font-medium text-neutral-700">Target:</span>{' '}
                <span className="text-neutral-900">{qrCode.target_url}</span>
              </p>
              <p className="text-neutral-600">
                <span className="font-medium text-neutral-700">Tracking URL:</span>{' '}
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
          </div>

          <img
            src={qrCode.qr_data_url}
            alt={qrCode.name}
            className="w-28 h-28 border border-neutral-200 rounded-lg ml-4"
          />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Analytics</h2>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-medium text-neutral-600 mb-1">Total Clicks</p>
            <p className="text-2xl font-semibold text-neutral-900">{totalClicks}</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-medium text-neutral-600 mb-1">Days Active</p>
            <p className="text-2xl font-semibold text-neutral-900">
              {Math.ceil(
                (new Date().getTime() - new Date(qrCode.created_at).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-medium text-neutral-600 mb-1">Avg Clicks/Day</p>
            <p className="text-2xl font-semibold text-neutral-900">
              {analytics.length > 0
                ? (totalClicks / analytics.length).toFixed(1)
                : '0'}
            </p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-medium text-neutral-600 mb-1">Peak Day</p>
            <p className="text-2xl font-semibold text-neutral-900">
              {analytics.length > 0
                ? Math.max(...analytics.map((a) => parseInt(a.clicks.toString())))
                : '0'}
            </p>
          </div>
        </div>

        {analytics.length > 0 ? (
          <AnalyticsChart data={analytics} />
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-xl">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-neutral-500">No clicks yet. Share your QR code to start tracking!</p>
          </div>
        )}
      </div>
    </div>
  );
}
