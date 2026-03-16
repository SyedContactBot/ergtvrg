'use client';

import { ContentCard } from '@/components/ui/ContentCard';
import type { Movie } from '@/types';

interface ContentGridProps {
  movies: Movie[];
  variant?: 'poster' | 'landscape';
}

export function ContentGrid({ movies, variant = 'poster' }: ContentGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-white/40">
        <p>No content found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <ContentCard key={movie.id} movie={movie} variant={variant} />
      ))}
    </div>
  );
}
