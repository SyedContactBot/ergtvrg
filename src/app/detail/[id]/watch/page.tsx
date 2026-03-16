import { getDetail } from '@/lib/api';
import { WatchClient } from './WatchClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const epNum = parseInt(sp.ep || '1');

  let movie;
  try {
    movie = await getDetail(id);
  } catch {
    notFound();
  }

  if (!movie) notFound();

  return <WatchClient movie={movie} currentEpisode={epNum} />;
}
