'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, Filter } from 'lucide-react';
import type { FilterCondition } from '@/types';

interface FilterBarProps {
  conditions: FilterCondition[];
  defaultType?: number;
}

export function FilterBar({ conditions, defaultType }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getActiveValue = (level: number): string => {
    const paramMap: Record<number, string> = {
      1: 'type',
      2: 'language',
      3: 'region',
      4: 'genre',
      5: 'year',
    };
    return searchParams.get(paramMap[level]) || '';
  };

  const setFilter = (level: number, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramMap: Record<number, string> = {
      1: 'type',
      2: 'language',
      3: 'region',
      4: 'genre',
      5: 'year',
    };
    const key = paramMap[level];
    if (!key) return;

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    if (defaultType) {
      router.push(`${pathname}?type=${defaultType}`);
    } else {
      router.push(pathname);
    }
  };

  const hasFilters = searchParams.toString().replace(`type=${defaultType}`, '').replace(/^&|&$/, '').length > 0;

  const filteredConditions = conditions.filter((c) => {
    if (defaultType && c.level === 1) return false;
    if (c.level === 2 && c.name === 'Sort') return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-white/50" />
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-full bg-red-600/20 px-3 py-1 text-xs text-red-400 hover:bg-red-600/30 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>
      {filteredConditions.map((condition) => (
        <div key={condition.level} className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">
            {condition.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(condition.level, '')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                !getActiveValue(condition.level)
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              All
            </button>
            {condition.items?.map((item) => (
              <button
                key={String(item.value)}
                onClick={() => setFilter(condition.level, String(item.value))}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  getActiveValue(condition.level) === String(item.value)
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
