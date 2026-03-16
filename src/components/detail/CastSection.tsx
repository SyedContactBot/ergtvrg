'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ScrollRow } from '@/components/ui/ScrollRow';
import { getImageUrl } from '@/lib/utils';
import type { ActorRef, PersonRef } from '@/types';

interface CastSectionProps {
  actors: ActorRef[];
  directors: PersonRef[];
}

export function CastSection({ actors, directors }: CastSectionProps) {
  const allCrew = [
    ...directors.map((d) => ({ ...d, role: 'Director', avatar: undefined as string | undefined })),
    ...actors.map((a) => ({ ...a, role: 'Actor' })),
  ];

  if (allCrew.length === 0) return null;

  return (
    <ScrollRow title="Cast & Crew">
      {allCrew.map((person) => (
        <Link
          key={`${person.role}-${person.id}`}
          href={`/actor/${person.id}`}
          className="flex flex-col items-center gap-2 shrink-0 w-[100px]"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white/10">
            {person.avatar ? (
              <Image
                src={getImageUrl(person.avatar)}
                alt={person.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/20">
                {person.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-white line-clamp-1">{person.name}</p>
            <p className="text-[10px] text-white/40">{person.role}</p>
          </div>
        </Link>
      ))}
    </ScrollRow>
  );
}
