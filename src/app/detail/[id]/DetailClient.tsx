'use client';

import { HeroSection } from '@/components/detail/HeroSection';
import { EpisodeList } from '@/components/detail/EpisodeList';
import { CastSection } from '@/components/detail/CastSection';
import { RecommendSection } from '@/components/detail/RecommendSection';
import type { MovieDetail, Movie } from '@/types';

interface DetailClientProps {
  movie: MovieDetail;
  recommendations: Movie[];
}

export function DetailClient({ movie, recommendations }: DetailClientProps) {
  return (
    <div className="pb-20 md:pb-0">
      <HeroSection movie={movie} />

      <div className="relative z-10 -mt-8 space-y-10">
        {movie.episodes && movie.episodes.length > 0 && (
          <EpisodeList
            episodes={movie.episodes}
            movieId={movie.id}
            seasonNumber={movie.seasonNumber}
          />
        )}

        <CastSection
          actors={movie.actors || []}
          directors={movie.directors || []}
        />

        <RecommendSection movies={recommendations} />
      </div>
    </div>
  );
}
