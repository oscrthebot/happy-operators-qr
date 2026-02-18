'use client';

import { useState } from 'react';

export default function CreateQRForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetUrl }),
      });

      const data = await res.json();

      if (data.success) {
        setName('');
        setTargetUrl('');
        onSuccess();
      } else {
        setError(data.error || 'Failed to create QR code');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Create New QR Code</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Table 5, Menu, WiFi"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Target URL
          </label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? 'Creating...' : 'Create QR Code'}
        </button>
      </form>
    </div>
  );
}
