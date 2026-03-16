'use client';

import { ContentRow } from '@/components/home/ContentRow';
import type { Movie } from '@/types';

interface RecommendSectionProps {
  movies: Movie[];
}

export function RecommendSection({ movies }: RecommendSectionProps) {
  if (!movies || movies.length === 0) return null;
  return <ContentRow title="You May Also Like" movies={movies} />;
}
