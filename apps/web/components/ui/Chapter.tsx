import { cn } from '@/lib/cn';
import type * as React from 'react';

type Props = {
  numeral?: string; // "I", "II", "III"...
  eyebrow?: string; // "Capítulo um · Convite"
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

/**
 * Cabeçalho de seção / capítulo no estilo magazine sacro.
 * Numeral romano grande, eyebrow mono-uppercase, título em serif italic.
 */
export function Chapter({
  numeral,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: Props) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <header className={cn('flex flex-col gap-3', alignCls, className)}>
      {numeral && (
        <span
          className="roman text-[clamp(2.5rem,4vw,3.75rem)] leading-none tracking-tight"
          aria-hidden
        >
          {numeral}.
        </span>
      )}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-balance max-w-3xl"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-[15px] text-(color:--color-ink-soft) leading-relaxed text-pretty max-w-2xl',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
