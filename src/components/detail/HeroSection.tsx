'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Clock, Globe, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { getImageUrl, formatDuration, formatYear, getResolutionBadge } from '@/lib/utils';
import { useWatchlistStore } from '@/lib/store';
import type { MovieDetail } from '@/types';

interface HeroSectionProps {
  movie: MovieDetail;
}

export function HeroSection({ movie }: HeroSectionProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(movie.id);
  const resBadge = getResolutionBadge(movie.resolution, movie.indiaResolutionLabel);

  return (
    <div className="relative min-h-[70vh]">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(movie.coverHorizontalImage || movie.coverVerticalImage)}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-[1440px] items-end gap-8 px-4 pb-12 pt-32 md:px-8 md:items-center md:min-h-[70vh]">
        {/* Poster */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block shrink-0"
        >
          <div className="relative h-[360px] w-[240px] overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
            <Image
              src={getImageUrl(movie.coverVerticalImage)}
              alt={movie.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="accent">{movie.movieTypeName || 'Movie'}</Badge>
            {resBadge && <Badge>{resBadge}</Badge>}
            {movie.tags?.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight">
            {movie.title}
          </h1>
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="mt-1 text-lg text-white/40">{movie.originalTitle}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
            {movie.score > 0 && <Rating score={movie.score} />}
            {movie.publishTime > 0 && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatYear(movie.publishTime)}
              </span>
            )}
            {movie.duration && movie.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(movie.duration)}
              </span>
            )}
            {movie.languages && movie.languages.length > 0 && (
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {movie.languages.join(', ')}
              </span>
            )}
          </div>

          {movie.briefIntroduction && (
            <p className="mt-4 max-w-2xl text-sm text-white/70 leading-relaxed md:text-base">
              {movie.briefIntroduction}
            </p>
          )}

          {/* Directors */}
          {movie.directors && movie.directors.length > 0 && (
            <p className="mt-3 text-sm text-white/50">
              <span className="text-white/30">Director: </span>
              {movie.directors.map((d) => d.name).join(', ')}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <Link
              href={`/detail/${movie.id}/watch`}
              className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:scale-105"
            >
              <Play className="h-5 w-5 fill-white" />
              Watch Now
            </Link>
            <button
              onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie.id)}
              className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              {inWatchlist ? (
                <><Check className="h-5 w-5 text-green-400" /> In Watchlist</>
              ) : (
                <><Plus className="h-5 w-5" /> Add to Watchlist</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
