'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Badge } from './Badge';
import { Rating } from './Rating';
import { getResolutionBadge, getImageUrl } from '@/lib/utils';
import type { Movie } from '@/types';

interface ContentCardProps {
  movie: Movie;
  variant?: 'poster' | 'landscape';
  priority?: boolean;
}

export function ContentCard({ movie, variant = 'poster', priority = false }: ContentCardProps) {
  const imageUrl = variant === 'poster'
    ? movie.coverVerticalImage
    : movie.coverHorizontalImage;
  const resBadge = getResolutionBadge(movie.resolution, movie.indiaResolutionLabel);

  return (
    <Link href={`/detail/${movie.id}`} className="block flex-shrink-0">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className={`relative overflow-hidden rounded-xl bg-white/5 ${
          variant === 'poster' ? 'w-[140px] md:w-[180px]' : 'w-[280px] md:w-[320px]'
        }`}
      >
        <div className={`relative ${variant === 'poster' ? 'aspect-[2/3]' : 'aspect-video'}`}>
          <Image
            src={getImageUrl(imageUrl)}
            alt={movie.title}
            fill
            className="object-cover"
            sizes={variant === 'poster' ? '180px' : '320px'}
            priority={priority}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center">
            <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
          {resBadge && (
            <div className="absolute top-2 right-2">
              <Badge variant="accent">{resBadge}</Badge>
            </div>
          )}
          {movie.movieType === 1 && movie.totalNumber && (
            <div className="absolute bottom-2 left-2">
              <Badge>EP {movie.totalNumber}</Badge>
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="line-clamp-1 text-sm font-medium text-white">
            {movie.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {movie.score > 0 && <Rating score={movie.score} className="scale-75 origin-left" />}
          </div>
          {movie.languages && movie.languages.length > 0 && (
            <p className="mt-0.5 text-xs text-white/50 line-clamp-1">
              {movie.languages.join(', ')}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
