'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Maximize, Minimize, SkipForward, SkipBack,
  Settings, ChevronDown, Loader2, AlertCircle,
} from 'lucide-react';
import type { Episode } from '@/types';

interface VideoPlayerProps {
  movieId: string;
  movieTitle: string;
  episodes: Episode[];
  currentEpisode?: number;
}

interface VideoPlayData {
  videoUrl: string;
  subtitles?: { url: string; title: string; isDefault: boolean }[];
}

export function VideoPlayer({
  movieId,
  movieTitle,
  episodes,
  currentEpisode = 1,
}: VideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<{ destroy: () => void } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(1);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoPlayData | null>(null);

  const episode = episodes.find((ep) => ep.number === currentEpisode) || episodes[0];
  const hasNext = currentEpisode < episodes.length;
  const hasPrev = currentEpisode > 1;

  const qualities = episode?.videos?.map((v) => ({
    label: v.resolutionDescription,
    resolution: v.resolution,
  })) || [{ label: 'SD 480P', resolution: 1 }];

  const selectedQualityLabel = qualities.find((q) => q.resolution === selectedResolution)?.label || 'SD 480P';

  const fetchVideoUrl = useCallback(async (resolution: number) => {
    if (!episode) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/video?movieId=${movieId}&episodeId=${episode.id}&resolution=${resolution}`,
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Failed to load video' }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.videoUrl) {
        throw new Error('No video URL returned');
      }
      setVideoData({
        videoUrl: data.videoUrl,
        subtitles: data.subtitles,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video');
    } finally {
      setLoading(false);
    }
  }, [movieId, episode]);

  useEffect(() => {
    fetchVideoUrl(selectedResolution);
  }, [fetchVideoUrl, selectedResolution]);

  useEffect(() => {
    if (!videoData?.videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    const url = videoData.videoUrl;

    if (url.includes('.m3u8')) {
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          if (hlsInstanceRef.current) {
            hlsInstanceRef.current.destroy();
          }
          const hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              setError('Video playback error. Try a different quality.');
            }
          });
          hlsInstanceRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
          video.play().catch(() => {});
        } else {
          setError('HLS playback is not supported in this browser');
        }
      }).catch(() => {
        setError('Failed to load video player');
      });
    } else {
      video.src = url;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [videoData]);

  useEffect(() => {
    if (videoData?.subtitles && videoRef.current) {
      const video = videoRef.current;
      const existingTracks = video.querySelectorAll('track');
      existingTracks.forEach((t) => t.remove());

      videoData.subtitles.forEach((sub) => {
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.label = sub.title;
        track.src = sub.url;
        track.default = sub.isDefault;
        video.appendChild(track);
      });
    }
  }, [videoData]);

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
              {selectedQualityLabel}
            </button>
            {showQuality && (
              <div className="absolute right-0 top-full mt-1 overflow-hidden rounded-lg bg-[#1a1a2e] shadow-xl border border-white/10">
                {qualities.map((q) => (
                  <button
                    key={q.resolution}
                    onClick={() => {
                      setSelectedResolution(q.resolution);
                      setShowQuality(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-xs transition-colors ${
                      q.resolution === selectedResolution
                        ? 'bg-red-600 text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {q.label}
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

      {/* Video player */}
      <div className="flex-1 relative flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
            <p className="mt-3 text-sm text-white/60">Loading video...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="mt-3 text-sm text-white/80">{error}</p>
            <button
              onClick={() => fetchVideoUrl(selectedResolution)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        <video
          ref={videoRef}
          className="h-full w-full"
          controls
          playsInline
          crossOrigin="anonymous"
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
