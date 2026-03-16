'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl, truncate } from '@/lib/utils';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import type { Movie } from '@/types';

interface HeroBannerProps {
  movies: Movie[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const featured = movies.slice(0, 6);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % featured.length);
  }, [featured.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + featured.length) % featured.length);
  }, [featured.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (!featured.length) return null;
  const movie = featured[current];

  return (
    <div className="relative h-[75vh] min-h-[500px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={getImageUrl(movie.coverHorizontalImage || movie.coverVerticalImage)}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative flex h-full items-end pb-24 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
          <motion.div
            key={movie.id + '-info'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent">{movie.movieTypeName || 'Movie'}</Badge>
              {movie.languages?.map((lang) => (
                <Badge key={lang} variant="outline">{lang}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl leading-tight">
              {movie.title}
            </h1>
            <div className="mt-3 flex items-center gap-4">
              {movie.score > 0 && <Rating score={movie.score} />}
              {movie.tags && movie.tags.length > 0 && (
                <span className="text-sm text-white/60">{movie.tags.slice(0, 3).join(' | ')}</span>
              )}
            </div>
            {movie.briefIntroduction && (
              <p className="mt-4 text-sm text-white/70 md:text-base leading-relaxed max-w-lg">
                {truncate(movie.briefIntroduction, 200)}
              </p>
            )}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={`/detail/${movie.id}/watch`}
                className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:scale-105"
              >
                <Play className="h-5 w-5 fill-white" />
                Watch Now
              </Link>
              <Link
                href={`/detail/${movie.id}`}
                className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Info className="h-5 w-5" />
                More Info
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button onClick={prev} className="rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20 transition-colors">
          <ChevronLeft className="h-4 w-4 text-white" />
        </button>
        <div className="flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? 'w-8 bg-red-500' : 'w-3 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        <button onClick={next} className="rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20 transition-colors">
          <ChevronRight className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}
