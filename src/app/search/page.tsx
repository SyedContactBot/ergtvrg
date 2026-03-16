'use client';

import { Suspense } from 'react';
import { SearchPage } from '@/components/search/SearchPage';
import { RowSkeleton } from '@/components/ui/Skeleton';

export default function SearchRoute() {
  return (
    <Suspense fallback={<div className="pt-24 px-4 md:px-8"><RowSkeleton /><RowSkeleton /></div>}>
      <SearchPage />
    </Suspense>
  );
}
