import Link from 'next/link';
import { Film } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Browse',
    links: [
      { label: 'Movies', href: '/movies' },
      { label: 'TV Shows', href: '/tv-shows' },
      { label: 'Live TV', href: '/livetv' },
      { label: 'Actors', href: '/actors' },
    ],
  },
  {
    title: 'Genres',
    links: [
      { label: 'Action', href: '/movies?genre=1003' },
      { label: 'Comedy', href: '/movies?genre=1006' },
      { label: 'Drama', href: '/movies?genre=1004' },
      { label: 'Thriller', href: '/movies?genre=1005' },
    ],
  },
  {
    title: 'Languages',
    links: [
      { label: 'Hindi', href: '/movies?language=1018' },
      { label: 'Tamil', href: '/movies?language=1033' },
      { label: 'Telugu', href: '/movies?language=1037' },
      { label: 'English', href: '/movies?language=1003' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
                <Film className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Flick<span className="text-red-500">Stream</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/50 max-w-xs">
              Your ultimate destination for movies, TV shows, live TV and more.
              Stream unlimited content in HD quality.
            </p>
          </div>
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/70">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} FlickStream. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
