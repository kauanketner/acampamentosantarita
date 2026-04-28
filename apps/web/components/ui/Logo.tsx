import { cn } from '@/lib/cn';

type Props = {
  className?: string;
  /** "auto" usa cor herdada (currentColor) */
  tone?: 'auto' | 'oxblood' | 'paper';
  size?: number;
};

/**
 * Logomark — arco com flor estilizada (Santa Rita das rosas).
 * Pareado com o admin pra manter família visual da marca.
 */
export function Logomark({ className, tone = 'auto', size = 32 }: Props) {
  const colorClass =
    tone === 'oxblood'
      ? 'text-(color:--color-oxblood)'
      : tone === 'paper'
        ? 'text-(color:--color-paper)'
        : '';
  return (
    <svg
      viewBox="0 0 32 36"
      width={size}
      height={size * (36 / 32)}
      fill="none"
      className={cn(colorClass, className)}
      aria-hidden
    >
      {/* Arco / capela */}
      <path
        d="M4 32V18C4 11.373 9.373 6 16 6C22.627 6 28 11.373 28 18V32"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Linha base */}
      <path d="M2 32H30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Flor central — 5 pétalas */}
      <g fill="currentColor">
        <ellipse cx="16" cy="14" rx="1.4" ry="3" />
        <ellipse cx="16" cy="22" rx="1.4" ry="3" />
        <ellipse cx="12" cy="18" rx="3" ry="1.4" />
        <ellipse cx="20" cy="18" rx="3" ry="1.4" />
        <circle cx="16" cy="18" r="1.5" />
      </g>
    </svg>
  );
}

/**
 * Wordmark — apenas o nome em serif italic, com pequena pétala antes.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-display tracking-tight inline-flex items-baseline gap-2 leading-none',
        className,
      )}
      style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 70" }}
    >
      <span aria-hidden className="text-(color:--color-accent-deep)">
        ❀
      </span>
      <span className="italic">Santa Rita</span>
    </span>
  );
}
