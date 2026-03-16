'use client';

import { HeroBanner } from '@/components/home/HeroBanner';
import { ContentRow } from '@/components/home/ContentRow';
import { TrendingSection } from '@/components/home/TrendingSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ScrollRow } from '@/components/ui/ScrollRow';
import { ActorCard } from '@/components/actors/ActorCard';
import type { Movie, Actor } from '@/types';

interface HomeClientProps {
  trendingMovies: Movie[];
  newestMovies: Movie[];
  trendingShows: Movie[];
  newestShows: Movie[];
  birthdayActors: Actor[];
}

export function HomeClient({
  trendingMovies,
  newestMovies,
  trendingShows,
  newestShows,
  birthdayActors,
}: HomeClientProps) {
  return (
    <div className="pb-20 md:pb-0">
      <HeroBanner movies={trendingMovies} />

      <div className="relative -mt-20 z-10 space-y-10 pt-4">
        <TrendingSection movies={trendingMovies} />
        <ContentRow title="New Releases" movies={newestMovies} />
        <ContentRow title="Popular TV Shows" movies={trendingShows} />
        <ContentRow title="New TV Shows" movies={newestShows} />

        {birthdayActors.length > 0 && (
          <ScrollRow title="Born Today">
            {birthdayActors.map((actor) => (
              <div key={actor.id} className="shrink-0">
                <ActorCard actor={actor} />
              </div>
            ))}
          </ScrollRow>
        )}

        <CategoryGrid />
      </div>
    </div>
  );
}
