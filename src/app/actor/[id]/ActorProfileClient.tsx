'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ContentGrid } from '@/components/browse/ContentGrid';
import { getImageUrl } from '@/lib/utils';
import type { Actor, Movie } from '@/types';

interface ActorProfileClientProps {
  actor: Actor;
  movies: Movie[];
}

export function ActorProfileClient({ actor, movies }: ActorProfileClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col items-center gap-6 md:flex-row md:items-start"
        >
          <div
            className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full shadow-2xl"
            style={{ backgroundColor: actor.bgColor || '#1a1a2e' }}
          >
            {actor.avatar ? (
              <Image
                src={getImageUrl(actor.avatar)}
                alt={actor.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-white/20">
                {actor.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white md:text-4xl">{actor.name}</h1>
            {actor.englishName && actor.englishName !== actor.name && (
              <p className="mt-1 text-lg text-white/40">{actor.englishName}</p>
            )}
            {actor.briefIntroduction && (
              <p className="mt-4 max-w-2xl text-sm text-white/60 leading-relaxed">
                {actor.briefIntroduction}
              </p>
            )}
          </div>
        </motion.div>

        <div>
          <h2 className="mb-6 text-xl font-bold text-white">
            Filmography ({movies.length})
          </h2>
          <ContentGrid movies={movies} />
        </div>
      </div>
    </div>
  );
}
