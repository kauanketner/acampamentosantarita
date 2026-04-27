import { cn } from '@/lib/cn';

type Props = {
  current: number;
  total: number;
  label?: string;
  className?: string;
};

export function Stepper({ current, total, label, className }: Props) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: total }, (_, i) => {
          const idx = i + 1;
          const state = idx < current ? 'done' : idx === current ? 'active' : 'pending';
          return (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-500',
                state === 'done' && 'bg-(color:--color-primary)',
                state === 'active' && 'bg-(color:--color-primary)',
                state === 'pending' && 'bg-(color:--color-border)',
              )}
              style={state === 'active' ? { boxShadow: '0 0 0 2px var(--color-ring)' } : undefined}
            />
          );
        })}
      </div>
      {label && (
        <span className="font-mono text-[11px] tracking-wider text-(color:--color-muted-foreground) uppercase shrink-0">
          {current.toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
        </span>
      )}
    </div>
  );
}
