import { cn } from '@/lib/cn';

type Props = {
  variant?: 'line' | 'hairline' | 'ornament';
  className?: string;
};

export function Separator({ variant = 'line', className }: Props) {
  if (variant === 'ornament') {
    return (
      <div className={cn('flex items-center justify-center gap-3 py-2', className)}>
        <span className="h-px flex-1 bg-(color:--color-border-strong)" />
        <span aria-hidden className="text-(color:--color-accent) font-display text-lg leading-none">
          ✦
        </span>
        <span className="h-px flex-1 bg-(color:--color-border-strong)" />
      </div>
    );
  }
  if (variant === 'hairline') return <div className={cn('hairline', className)} />;
  return <div className={cn('h-px w-full bg-(color:--color-border)', className)} />;
}
