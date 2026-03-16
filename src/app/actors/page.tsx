'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { AlphabetNav } from '@/components/actors/AlphabetNav';
import { ActorCard } from '@/components/actors/ActorCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { getActorsByLetter } from '@/lib/api';
import type { Actor } from '@/types';

export default function ActorsPage() {
  const [letter, setLetter] = useState('A');
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActors = useCallback(async (l: string) => {
    try {
      const data = await getActorsByLetter(l);
      setActors(data.rows || []);
    } catch {
      setActors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchActors(letter);
  }, [letter, fetchActors]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-7 w-7 text-red-500" />
            <h1 className="text-3xl font-bold text-white">Actors & Directors</h1>
          </div>

          <div className="mb-8 rounded-2xl bg-white/5 p-4 border border-white/5">
            <AlphabetNav activeLetter={letter} onSelect={setLetter} />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : actors.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-white/40">
              No actors found for letter &quot;{letter}&quot;
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {actors.map((actor) => (
                <ActorCard key={actor.id} actor={actor} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
