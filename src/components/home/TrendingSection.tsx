'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, TrendingUp } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import type { Movie } from '@/types';

interface TrendingSectionProps {
  movies: Movie[];
}

export function TrendingSection({ movies }: TrendingSectionProps) {
  if (!movies || movies.length === 0) return null;
  const top10 = movies.slice(0, 10);

  return (
    <section className="px-4 md:px-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-red-500" />
        <h2 className="text-xl font-bold text-white md:text-2xl">Top 10 Trending</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {top10.map((movie, index) => (
          <Link key={movie.id} href={`/detail/${movie.id}`}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="group relative flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
            >
              <span className="text-4xl font-black text-white/10 w-10 text-center shrink-0">
                {index + 1}
              </span>
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={getImageUrl(movie.coverVerticalImage)}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-white text-sm line-clamp-1">{movie.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {movie.score > 0 && (
                    <Rating score={movie.score} showNumber={false} className="scale-75 origin-left" />
                  )}
                  <Badge variant="outline" className="text-[10px]">
                    {movie.movieTypeName || 'Movie'}
                  </Badge>
                </div>
                {movie.languages && (
                  <p className="text-[10px] text-white/40 mt-1">
                    {movie.languages.slice(0, 2).join(', ')}
                  </p>
                )}
              </div>
              <Play className="h-5 w-5 text-white/30 group-hover:text-red-500 transition-colors shrink-0" />
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
