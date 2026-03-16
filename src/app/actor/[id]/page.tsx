import { getActorInfo, getMoviesByActor } from '@/lib/api';
import { ActorProfileClient } from './ActorProfileClient';
import { notFound } from 'next/navigation';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ActorPage({ params }: PageProps) {
  const { id } = await params;

  let actor, movies;
  try {
    [actor, movies] = await Promise.all([
      getActorInfo(id),
      getMoviesByActor(id).catch(() => ({ rows: [], pages: 0, total: 0, page: 1, size: 20 })),
    ]);
  } catch {
    notFound();
  }

  if (!actor) notFound();

  return <ActorProfileClient actor={actor} movies={movies?.rows || []} />;
}
