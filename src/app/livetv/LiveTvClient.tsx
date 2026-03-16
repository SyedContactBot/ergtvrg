'use client';

import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { CategoryFilter } from '@/components/livetv/CategoryFilter';
import { ChannelGrid } from '@/components/livetv/ChannelGrid';
import { Pagination } from '@/components/browse/Pagination';
import type { CategoryOption, LanguageOption, LiveTvChannel } from '@/types';

interface LiveTvClientProps {
  categories: CategoryOption[];
  languages: LanguageOption[];
  channels: LiveTvChannel[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export function LiveTvClient({
  categories,
  languages,
  channels,
  currentPage,
  totalPages,
  total,
}: LiveTvClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Radio className="h-7 w-7 text-red-500" />
            <h1 className="text-3xl font-bold text-white">Live TV</h1>
            <span className="flex items-center gap-1 rounded-full bg-red-600/20 px-3 py-1 text-xs text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {total} Channels
            </span>
          </div>

          <div className="mb-8 rounded-2xl bg-white/5 p-4 border border-white/5">
            <CategoryFilter categories={categories} languages={languages} />
          </div>

          <ChannelGrid channels={channels} />
          <Pagination currentPage={currentPage} totalPages={totalPages} total={total} />
        </motion.div>
      </div>
    </div>
  );
}
