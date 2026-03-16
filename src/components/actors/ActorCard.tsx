'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';
import type { Actor } from '@/types';

interface ActorCardProps {
  actor: Actor;
}

export function ActorCard({ actor }: ActorCardProps) {
  return (
    <Link href={`/actor/${actor.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex flex-col items-center gap-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
      >
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white/10">
          {actor.avatar ? (
            <Image
              src={getImageUrl(actor.avatar)}
              alt={actor.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/20">
              {actor.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-white line-clamp-1">{actor.name}</h3>
          {actor.englishName && actor.englishName !== actor.name && (
            <p className="text-[11px] text-white/40 line-clamp-1">{actor.englishName}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
