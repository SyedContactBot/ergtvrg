import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
        variant === 'default' && 'bg-white/15 text-white',
        variant === 'accent' && 'bg-red-600 text-white',
        variant === 'outline' && 'border border-white/30 text-white/80',
        className,
      )}
    >
      {children}
    </span>
  );
}
