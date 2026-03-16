'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollRowProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function ScrollRow({ children, title, className }: ScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  return (
    <div className={cn('relative group', className)}>
      {title && (
        <h2 className="mb-4 text-xl font-bold text-white md:text-2xl px-4 md:px-8">
          {title}
        </h2>
      )}
      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-[#0a0a0a] to-transparent opacity-0 transition-opacity group-hover:opacity-100 md:flex"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
        )}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide md:gap-4 md:px-8"
        >
          {children}
        </div>
        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-[#0a0a0a] to-transparent opacity-0 transition-opacity group-hover:opacity-100 md:flex"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
