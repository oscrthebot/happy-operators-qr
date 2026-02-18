'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartBar, House, QrCode } from 'phosphor-react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Dashboard', icon: House },
  { href: '/qr', label: 'QR Codes', icon: QrCode },
  { href: '/analytics', label: 'Analytics', icon: ChartBar },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-colors">
      {/* Logo & Branding */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-2">
          <Image
            src="/happy-operators-logo.svg"
            alt="Happy Operators"
            width={32}
            height={32}
            className="flex-shrink-0"
          />
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Happy Operators
            </h1>
          </div>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">QR Manager</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon weight={isActive ? 'fill' : 'regular'} size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Theme
          </span>
          <ThemeToggle />
        </div>
        
        {/* Footer branding */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Powered by</span>
          <Image
            src="/happy-operators-logo.svg"
            alt="Happy Operators"
            width={16}
            height={16}
          />
          <span className="font-medium">Happy Operators</span>
        </div>
      </div>
    </aside>
  );
}
