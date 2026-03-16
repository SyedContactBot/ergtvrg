import { getMostViewed, getNewest, getTodayBirthdays } from '@/lib/api';
import { HomeClient } from './HomeClient';

export const revalidate = 300;

export default async function HomePage() {
  let trendingMovies, newestMovies, trendingShows, newestShows, birthdayActors;

  try {
    [trendingMovies, newestMovies, trendingShows, newestShows, birthdayActors] = await Promise.all([
      getMostViewed(2).catch(() => []),
      getNewest(2).catch(() => []),
      getMostViewed(1).catch(() => []),
      getNewest(1).catch(() => []),
      getTodayBirthdays().catch(() => ({ rows: [] })),
    ]);
  } catch {
    trendingMovies = [];
    newestMovies = [];
    trendingShows = [];
    newestShows = [];
    birthdayActors = { rows: [] };
  }

  return (
    <HomeClient
      trendingMovies={trendingMovies || []}
      newestMovies={newestMovies || []}
      trendingShows={trendingShows || []}
      newestShows={newestShows || []}
      birthdayActors={birthdayActors?.rows || []}
    />
  );
}
