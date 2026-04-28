import { cn } from '@/lib/cn';
import type * as React from 'react';

export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

const toneClass: Record<Tone, string> = {
  neutral:
    'bg-(color:--color-surface-2) text-(color:--color-foreground) border-(color:--color-border)',
  primary:
    'bg-(color:--color-primary-soft) text-(color:--color-primary) border-(color:--color-primary)/25',
  success:
    'bg-(color:--color-success-soft) text-(color:--color-success) border-(color:--color-success)/25',
  warning:
    'bg-(color:--color-warning-soft) text-(color:--color-warning) border-(color:--color-warning)/30',
  danger:
    'bg-(color:--color-danger-soft) text-(color:--color-danger) border-(color:--color-danger)/30',
  info: 'bg-(color:--color-info-soft) text-(color:--color-info) border-(color:--color-info)/25',
  accent:
    'bg-(color:--color-accent)/15 text-(color:--color-accent) border-(color:--color-accent)/30',
};

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  dot?: boolean;
  size?: 'sm' | 'md';
};

export function Badge({
  tone = 'neutral',
  dot,
  size = 'sm',
  className,
  children,
  ...props
}: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px] uppercase tracking-[0.06em]'
          : 'px-2.5 py-1 text-xs',
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className="inline-block size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
