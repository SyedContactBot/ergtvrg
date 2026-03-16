import { create } from 'zustand';

interface WatchlistState {
  watchlist: string[];
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('watchlist') || '[]')
    : [],
  addToWatchlist: (id: string) => {
    const updated = [...get().watchlist, id];
    localStorage.setItem('watchlist', JSON.stringify(updated));
    set({ watchlist: updated });
  },
  removeFromWatchlist: (id: string) => {
    const updated = get().watchlist.filter((item) => item !== id);
    localStorage.setItem('watchlist', JSON.stringify(updated));
    set({ watchlist: updated });
  },
  isInWatchlist: (id: string) => get().watchlist.includes(id),
}));

interface SearchHistoryState {
  history: string[];
  addSearch: (term: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>((set, get) => ({
  history: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('searchHistory') || '[]')
    : [],
  addSearch: (term: string) => {
    const current = get().history.filter((h) => h !== term);
    const updated = [term, ...current].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
    set({ history: updated });
  },
  clearHistory: () => {
    localStorage.setItem('searchHistory', '[]');
    set({ history: [] });
  },
}));
