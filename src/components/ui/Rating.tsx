import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  score: number;
  className?: string;
  showNumber?: boolean;
}

export function Rating({ score, className, showNumber = true }: RatingProps) {
  if (!score) return null;
  const stars = Math.round(score / 2);
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-white/20',
          )}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-yellow-400">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
}
