import { cn } from '@/lib/cn';
import type * as React from 'react';

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  italic?: boolean;
  align?: 'left' | 'center';
  className?: string;
  trailing?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  italic = false,
  align = 'left',
  className,
  trailing,
}: Props) {
  return (
    <div className={cn('px-5 pt-5 pb-3', align === 'center' && 'text-center', className)}>
      <div className={cn('flex items-start gap-3', align === 'center' && 'flex-col items-center')}>
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground) mb-2">
              {eyebrow}
            </p>
          )}
          <h1
            className={cn(
              'font-display text-[clamp(1.85rem,8vw,2.5rem)] leading-[1.05] tracking-[-0.025em] text-balance',
              italic && 'font-display-italic',
            )}
            style={{
              fontVariationSettings: italic ? "'opsz' 144, 'SOFT' 100" : "'opsz' 144, 'SOFT' 50",
            }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-[15px] leading-relaxed text-(color:--color-muted-foreground) text-pretty">
              {description}
            </p>
          )}
        </div>
        {trailing && align === 'left' && <div className="shrink-0">{trailing}</div>}
      </div>
    </div>
  );
}
