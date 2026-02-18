import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Operators QR Manager',
  description: 'QR Code Generator with Analytics',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-neutral-50 min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar - Twenty.com style */}
          <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
            <div className="p-6 border-b border-neutral-200">
              <h1 className="text-xl font-semibold text-neutral-900">
                <span className="text-primary">Happy Operators</span>
              </h1>
              <p className="text-sm text-neutral-500 mt-1">QR Manager</p>
            </div>
            
            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                <li>
                  <a href="/" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                    <span className="mr-3">📊</span>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                    <span className="mr-3">📱</span>
                    QR Codes
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                    <span className="mr-3">📈</span>
                    Analytics
                  </a>
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t border-neutral-200">
              <div className="text-xs text-neutral-500">
                Powered by Convex
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
