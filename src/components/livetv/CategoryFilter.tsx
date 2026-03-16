'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { CategoryOption, LanguageOption } from '@/types';

interface CategoryFilterProps {
  categories: CategoryOption[];
  languages: LanguageOption[];
}

export function CategoryFilter({ categories, languages }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') || '0';
  const activeLanguage = searchParams.get('language') || '0';

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={String(cat.value)}
              onClick={() => setFilter('category', String(cat.value))}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeCategory === String(cat.value)
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Language</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={String(lang.value)}
              onClick={() => setFilter('language', String(lang.value))}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeLanguage === String(lang.value)
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
