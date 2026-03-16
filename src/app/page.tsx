import { browseContent, getTodayBirthdays } from '@/lib/api';
import { HomeClient } from './HomeClient';

export const revalidate = 300;

export default async function HomePage() {
  let trendingMovies, newestMovies, trendingShows, newestShows, birthdayActors;

  try {
    [trendingMovies, newestMovies, trendingShows, newestShows, birthdayActors] = await Promise.all([
      browseContent({ type: 2 }, 1, 10).catch(() => ({ rows: [] })),
      browseContent({ type: 2 }, 2, 10).catch(() => ({ rows: [] })),
      browseContent({ type: 1 }, 1, 10).catch(() => ({ rows: [] })),
      browseContent({ type: 1 }, 2, 10).catch(() => ({ rows: [] })),
      getTodayBirthdays().catch(() => ({ rows: [] })),
    ]);
  } catch {
    trendingMovies = { rows: [] };
    newestMovies = { rows: [] };
    trendingShows = { rows: [] };
    newestShows = { rows: [] };
    birthdayActors = { rows: [] };
  }

  return (
    <HomeClient
      trendingMovies={trendingMovies?.rows || []}
      newestMovies={newestMovies?.rows || []}
      trendingShows={trendingShows?.rows || []}
      newestShows={newestShows?.rows || []}
      birthdayActors={birthdayActors?.rows || []}
    />
  );
}
