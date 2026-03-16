'use client';

import { cn } from '@/lib/utils';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface AlphabetNavProps {
  activeLetter: string;
  onSelect: (letter: string) => void;
}

export function AlphabetNav({ activeLetter, onSelect }: AlphabetNavProps) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {LETTERS.map((letter) => (
        <button
          key={letter}
          onClick={() => onSelect(letter)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all',
            activeLetter === letter
              ? 'bg-red-600 text-white scale-110'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white',
          )}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
