'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import type { LiveTvChannel } from '@/types';

interface ChannelGridProps {
  channels: LiveTvChannel[];
}

export function ChannelGrid({ channels }: ChannelGridProps) {
  if (!channels || channels.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-white/40">
        <p>No channels found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {channels.map((channel) => (
        <motion.div
          key={channel.id}
          whileHover={{ scale: 1.05 }}
          className="group relative overflow-hidden rounded-xl bg-white/5 p-4 text-center transition-colors hover:bg-white/10 cursor-pointer"
        >
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 rounded-full bg-red-600/20 px-2 py-0.5 text-[10px] text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-xl bg-white/10">
            {channel.coverImage ? (
              <Image
                src={getImageUrl(channel.coverImage)}
                alt={channel.name}
                fill
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Radio className="h-8 w-8 text-white/20" />
              </div>
            )}
          </div>
          <h3 className="mt-3 text-sm font-medium text-white line-clamp-2">{channel.name}</h3>
        </motion.div>
      ))}
    </div>
  );
}
