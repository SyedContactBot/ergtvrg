import { getSearchConditions, browseContent } from '@/lib/api';
import { BrowseClient } from './BrowseClient';

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const filters = {
    type: params.type || '2',
    language: params.language || '',
    genre: params.genre || '',
    region: params.region || '',
    year: params.year || '',
  };

  let conditions, content;
  try {
    [conditions, content] = await Promise.all([
      getSearchConditions().catch(() => []),
      browseContent(filters, page, 20).catch(() => ({ rows: [], pages: 0, total: 0, page: 1, size: 20 })),
    ]);
  } catch {
    conditions = [];
    content = { rows: [], pages: 0, total: 0, page: 1, size: 20 };
  }

  return (
    <BrowseClient
      title="Movies"
      defaultType={2}
      conditions={conditions || []}
      movies={content?.rows || []}
      currentPage={content?.page || 1}
      totalPages={content?.pages || 0}
      total={content?.total || 0}
    />
  );
}
