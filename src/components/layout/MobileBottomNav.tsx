'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Tv, Radio, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/tv-shows', label: 'TV Shows', icon: Tv },
  { href: '/livetv', label: 'Live TV', icon: Radio },
  { href: '/search', label: 'Search', icon: Search },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 text-[10px]',
                isActive ? 'text-red-500' : 'text-white/50',
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-red-500')} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
