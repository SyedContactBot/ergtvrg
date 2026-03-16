'use client';

import { ScrollRow } from '@/components/ui/ScrollRow';
import { ContentCard } from '@/components/ui/ContentCard';
import type { Movie } from '@/types';

interface ContentRowProps {
  title: string;
  movies: Movie[];
  variant?: 'poster' | 'landscape';
}

export function ContentRow({ title, movies, variant = 'poster' }: ContentRowProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <ScrollRow title={title}>
      {movies.map((movie, index) => (
        <ContentCard key={movie.id} movie={movie} variant={variant} priority={index < 4} />
      ))}
    </ScrollRow>
  );
}
