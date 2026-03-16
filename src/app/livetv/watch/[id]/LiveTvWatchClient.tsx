'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft, Maximize, Minimize, Radio, Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

interface LiveTvWatchClientProps {
  channelId: string;
  channelName: string;
  channelImage: string;
}

export function LiveTvWatchClient({
  channelId,
  channelName,
  channelImage,
}: LiveTvWatchClientProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<{ destroy: () => void } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  const fetchStream = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/livetv?id=${channelId}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Failed to load stream' }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.streamUrl) {
        throw new Error('No stream URL available for this channel');
      }
      setStreamUrl(data.streamUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stream');
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchStream();
  }, [fetchStream]);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (streamUrl.includes('.m3u8')) {
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          if (hlsInstanceRef.current) {
            hlsInstanceRef.current.destroy();
          }
          const hls = new Hls({
            maxBufferLength: 10,
            maxMaxBufferLength: 30,
            liveSyncDurationCount: 3,
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              setError('Stream playback error. The channel may be temporarily unavailable.');
            }
          });
          hlsInstanceRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
          video.play().catch(() => {});
        } else {
          setError('HLS playback is not supported in this browser');
        }
      }).catch(() => {
        setError('Failed to load video player');
      });
    } else {
      video.src = streamUrl;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [streamUrl]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="relative flex h-screen flex-col bg-black">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/livetv')}
            className="rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            {channelImage && (
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/10">
                <Image
                  src={getImageUrl(channelImage)}
                  alt={channelName}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
            )}
            <div>
              <h1 className="text-sm font-semibold text-white md:text-base">{channelName}</h1>
              <span className="flex items-center gap-1 text-xs text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Video player area */}
      <div className="flex-1 relative flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
            <p className="mt-3 text-sm text-white/60">Loading stream...</p>
          </div>
        )}
        {error && !streamUrl && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
            <div className="flex flex-col items-center max-w-md text-center">
              {channelImage ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white/10 mb-4">
                  <Image
                    src={getImageUrl(channelImage)}
                    alt={channelName}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              ) : (
                <Radio className="h-16 w-16 text-white/20 mb-4" />
              )}
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-white/80 mb-1">{error}</p>
              <p className="text-xs text-white/40 mb-4">This channel&apos;s stream may not be available right now.</p>
              <div className="flex gap-3">
                <button
                  onClick={fetchStream}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
                <button
                  onClick={() => router.push('/livetv')}
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                >
                  Back to Channels
                </button>
              </div>
            </div>
          </div>
        )}
        {streamUrl && (
          <video
            ref={videoRef}
            className="h-full w-full"
            controls
            playsInline
            autoPlay
            crossOrigin="anonymous"
          />
        )}
      </div>
    </div>
  );
}
