import { cn } from '@/lib/cn';
import type * as React from 'react';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const accentBar: Record<Tone, string> = {
  neutral: 'bg-(color:--color-border-strong)',
  primary: 'bg-(color:--color-primary)',
  success: 'bg-(color:--color-success)',
  warning: 'bg-(color:--color-warning)',
  danger: 'bg-(color:--color-danger)',
  info: 'bg-(color:--color-info)',
};

type Props = {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: Tone;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

export function Stat({ label, value, hint, tone = 'neutral', className, onClick, icon }: Props) {
  const interactive = !!onClick;
  const Wrapper = interactive ? 'button' : 'div';

  return (
    <Wrapper
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden text-left',
        'rounded-(--radius-lg) border border-(color:--color-border) bg-(color:--color-surface)',
        'p-5',
        interactive &&
          'hover:bg-(color:--color-surface-2) transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-primary)/35',
        className,
      )}
    >
      {/* barra de acento à esquerda */}
      <span
        aria-hidden
        className={cn('absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full', accentBar[tone])}
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-(color:--color-muted-foreground)">
            {label}
          </p>
          <p
            className="font-display text-[28px] leading-[1.1] tracking-tight tabular-nums mt-1"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
          >
            {value}
          </p>
          {hint && (
            <p className="text-[11px] text-(color:--color-muted-foreground) mt-1.5">{hint}</p>
          )}
        </div>
        {icon && (
          <span className="size-8 rounded-full bg-(color:--color-surface-2) text-(color:--color-muted-foreground) inline-flex items-center justify-center">
            {icon}
          </span>
        )}
      </div>
    </Wrapper>
  );
}
