import { getLiveTvCategories, getLiveTvLanguages, getLiveTvChannels } from '@/lib/api';
import { LiveTvClient } from './LiveTvClient';

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function LiveTvPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryId = params.category || '0';
  const languageId = params.language || '0';
  const page = parseInt(params.page || '1');

  let categories, languages, channels;
  try {
    [categories, languages, channels] = await Promise.all([
      getLiveTvCategories().catch(() => []),
      getLiveTvLanguages().catch(() => []),
      getLiveTvChannels(Number(languageId), categoryId, page, 30).catch(() => ({
        rows: [], pages: 0, total: 0, page: 1, size: 30,
      })),
    ]);
  } catch {
    categories = [];
    languages = [];
    channels = { rows: [], pages: 0, total: 0, page: 1, size: 30 };
  }

  return (
    <LiveTvClient
      categories={categories || []}
      languages={languages || []}
      channels={channels?.rows || []}
      currentPage={channels?.page || 1}
      totalPages={channels?.pages || 0}
      total={channels?.total || 0}
    />
  );
}
