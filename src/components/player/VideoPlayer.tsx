'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Maximize, Minimize, SkipForward, SkipBack,
  Settings, ChevronDown,
} from 'lucide-react';
import type { Episode } from '@/types';

interface VideoPlayerProps {
  movieId: string;
  movieTitle: string;
  episodes: Episode[];
  currentEpisode?: number;
}

export function VideoPlayer({
  movieId,
  movieTitle,
  episodes,
  currentEpisode = 1,
}: VideoPlayerProps) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('HD 720P');
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  const episode = episodes.find((ep) => ep.number === currentEpisode) || episodes[0];
  const hasNext = currentEpisode < episodes.length;
  const hasPrev = currentEpisode > 1;

  const qualities = episode?.videos?.map((v) => v.resolutionDescription) || ['SD 480P', 'HD 720P'];

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const goToEpisode = (epNum: number) => {
    router.push(`/detail/${movieId}/watch?ep=${epNum}`);
    setShowEpisodeList(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'f':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  const playerUrl = `https://player.moviemmm.com`;

  return (
    <div className="relative flex h-screen flex-col bg-black">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/detail/${movieId}`)}
            className="rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-white md:text-base">{movieTitle}</h1>
            {episodes.length > 1 && episode && (
              <p className="text-xs text-white/50">Episode {currentEpisode}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Quality selector */}
          <div className="relative">
            <button
              onClick={() => setShowQuality(!showQuality)}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              {selectedQuality}
            </button>
            {showQuality && (
              <div className="absolute right-0 top-full mt-1 overflow-hidden rounded-lg bg-[#1a1a2e] shadow-xl border border-white/10">
                {qualities.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setSelectedQuality(q); setShowQuality(false); }}
                    className={`block w-full px-4 py-2 text-left text-xs transition-colors ${
                      q === selectedQuality
                        ? 'bg-red-600 text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="rounded-lg bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4 text-white" />
            ) : (
              <Maximize className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Player iframe */}
      <div className="flex-1 relative">
        <iframe
          src={playerUrl}
          className="h-full w-full"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen"
          title={movieTitle}
        />
      </div>

      {/* Bottom controls for episodes */}
      {episodes.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => hasPrev && goToEpisode(currentEpisode - 1)}
                disabled={!hasPrev}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-sm hover:bg-white/20 transition-colors disabled:opacity-30"
              >
                <SkipBack className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => hasNext && goToEpisode(currentEpisode + 1)}
                disabled={!hasNext}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-sm hover:bg-white/20 transition-colors disabled:opacity-30"
              >
                Next
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setShowEpisodeList(!showEpisodeList)}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              Episodes
              <ChevronDown className={`h-4 w-4 transition-transform ${showEpisodeList ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showEpisodeList && (
            <div className="mt-3 max-h-48 overflow-y-auto rounded-xl bg-[#1a1a2e]/95 p-3 backdrop-blur-lg">
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                {episodes.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => goToEpisode(ep.number)}
                    className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                      ep.number === currentEpisode
                        ? 'bg-red-600 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {ep.number}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
