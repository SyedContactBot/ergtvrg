'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { getImageUrl, formatDuration } from '@/lib/utils';
import type { Episode } from '@/types';

interface EpisodeListProps {
  episodes: Episode[];
  movieId: string;
  seasonNumber?: number;
  totalSeasons?: number;
}

export function EpisodeList({ episodes, movieId }: EpisodeListProps) {
  const [visibleCount, setVisibleCount] = useState(20);

  if (!episodes || episodes.length === 0) return null;

  const visible = episodes.slice(0, visibleCount);

  return (
    <section className="px-4 md:px-8">
      <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">
        Episodes ({episodes.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((ep) => (
          <Link
            key={ep.id}
            href={`/detail/${movieId}/watch?ep=${ep.number}`}
            className="group flex gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
          >
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
              {ep.coverImage ? (
                <Image
                  src={getImageUrl(ep.coverImage)}
                  alt={ep.title || `Episode ${ep.number}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10">
                  <Play className="h-6 w-6 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-red-400">EP {ep.number}</span>
                {ep.videos && ep.videos.length > 0 && (
                  <Badge className="text-[10px]">
                    {ep.videos[ep.videos.length - 1].resolutionDescription || 'SD'}
                  </Badge>
                )}
              </div>
              <h3 className="mt-1 text-sm font-medium text-white line-clamp-1">
                {ep.title || `Episode ${ep.number}`}
              </h3>
              {ep.duration > 0 && (
                <span className="mt-1 flex items-center gap-1 text-xs text-white/40">
                  <Clock className="h-3 w-3" />
                  {formatDuration(ep.duration)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
      {visibleCount < episodes.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 20)}
          className="mt-4 w-full rounded-xl bg-white/5 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          Show More Episodes
        </button>
      )}
    </section>
  );
}
