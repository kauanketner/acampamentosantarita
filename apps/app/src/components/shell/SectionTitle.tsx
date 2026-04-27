import type * as React from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
};

export function SectionTitle({ children, trailing, className }: Props) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-2 px-5 pt-7 pb-2.5',
        className,
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
        {children}
      </p>
      {trailing && <div className="text-xs text-(color:--color-muted-foreground)">{trailing}</div>}
    </div>
  );
}
