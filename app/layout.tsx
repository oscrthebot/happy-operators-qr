import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Operators QR Manager',
  description: 'QR Code Generator with Analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              <span className="text-primary">Happy Operators</span> QR Manager
            </h1>
            <p className="text-gray-600 mt-2">
              Create, track, and analyze your QR codes
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
