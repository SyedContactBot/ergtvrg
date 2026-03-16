'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentGrid } from '@/components/browse/ContentGrid';
import { Pagination } from '@/components/browse/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { search, searchSuggestions } from '@/lib/api';
import { useSearchHistoryStore } from '@/lib/store';
import type { Movie, SearchHighlightMovie } from '@/types';

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchHighlightMovie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const { history, addSearch, clearHistory } = useSearchHistoryStore();

  const performSearch = useCallback(async (q: string, p: number) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data = await search(q, p, 20);
      setResults(data.rows || []);
      setTotalPages(data.pages || 0);
      setTotal(data.total || 0);
      addSearch(q);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [addSearch]);

  useEffect(() => {
    if (query) {
      setInputValue(query);
      performSearch(query, page);
    }
  }, [query, page, performSearch]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          const data = await searchSuggestions(value);
          setSuggestions(data.movies || []);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const handleSuggestionClick = (id: string) => {
    setShowSuggestions(false);
    router.push(`/detail/${id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        {/* Search input */}
        <div className="relative mb-8">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 px-4">
              <SearchIcon className="h-5 w-5 text-white/40 shrink-0" />
              <input
                type="text"
                placeholder="Search movies, TV shows, actors..."
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => inputValue.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full bg-transparent py-4 pl-3 text-white placeholder-white/30 outline-none"
                autoFocus
              />
              {inputValue && (
                <button type="button" onClick={() => { setInputValue(''); setSuggestions([]); setShowSuggestions(false); }}>
                  <X className="h-5 w-5 text-white/40 hover:text-white" />
                </button>
              )}
            </div>
          </form>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl"
              >
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSuggestionClick(s.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5 transition-colors"
                  >
                    <SearchIcon className="h-4 w-4 text-white/30 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: s.highLightTitle || s.title }} />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search history */}
        {!query && history.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Clock className="h-4 w-4" />
                Recent Searches
              </h3>
              <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300">
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((term) => (
                <button
                  key={term}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                  className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div>
            <h2 className="mb-4 text-lg text-white/60">
              {loading ? 'Searching...' : `${total} results for "${query}"`}
            </h2>
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                <ContentGrid movies={results} />
                <Pagination currentPage={page} totalPages={totalPages} total={total} />
              </>
            )}
          </div>
        )}

        {/* Empty state */}
        {!query && history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 text-white/30">
            <SearchIcon className="h-12 w-12 mb-4" />
            <p>Search for movies, TV shows, and more</p>
          </div>
        )}
      </div>
    </div>
  );
}
