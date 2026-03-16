'use client';

import { VideoPlayer } from '@/components/player/VideoPlayer';
import type { MovieDetail } from '@/types';

interface WatchClientProps {
  movie: MovieDetail;
  currentEpisode: number;
}

export function WatchClient({ movie, currentEpisode }: WatchClientProps) {
  return (
    <VideoPlayer
      movieId={movie.id}
      movieTitle={movie.title}
      episodes={movie.episodes || []}
      currentEpisode={currentEpisode}
    />
  );
}
