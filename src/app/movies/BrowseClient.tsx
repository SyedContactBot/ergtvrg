'use client';

import { motion } from 'framer-motion';
import { FilterBar } from '@/components/browse/FilterBar';
import { ContentGrid } from '@/components/browse/ContentGrid';
import { Pagination } from '@/components/browse/Pagination';
import type { Movie, FilterCondition } from '@/types';

interface BrowseClientProps {
  title: string;
  defaultType: number;
  conditions: FilterCondition[];
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export function BrowseClient({
  title,
  defaultType,
  conditions,
  movies,
  currentPage,
  totalPages,
  total,
}: BrowseClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-6 text-3xl font-bold text-white">{title}</h1>

          <div className="mb-8 rounded-2xl bg-white/5 p-4 border border-white/5">
            <FilterBar conditions={conditions} defaultType={defaultType} />
          </div>

          <div className="mb-4 text-sm text-white/40">
            {total > 0 ? `${total} results found` : 'No results'}
          </div>

          <ContentGrid movies={movies} />
          <Pagination currentPage={currentPage} totalPages={totalPages} total={total} />
        </motion.div>
      </div>
    </div>
  );
}
