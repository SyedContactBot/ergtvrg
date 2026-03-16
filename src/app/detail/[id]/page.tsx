import { getDetail, getRecommendations } from '@/lib/api';
import { DetailClient } from './DetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: PageProps) {
  const { id } = await params;
  
  let movie, recommendations;
  try {
    [movie, recommendations] = await Promise.all([
      getDetail(id),
      getRecommendations(id).catch(() => []),
    ]);
  } catch {
    notFound();
  }

  if (!movie) notFound();

  return <DetailClient movie={movie} recommendations={recommendations || []} />;
}
