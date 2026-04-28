import { cn } from '@/lib/cn';

type Props = {
  className?: string;
  variant?: 'outline' | 'filled' | 'gold';
  withInner?: boolean;
};

// O arco — recorrente em momentos contemplativos. Limiar, presença, silêncio.
// Inspirado em portais românicos: arco pleno + inner arch (vesica piscis-like).
export function ArchMotif({ className, variant = 'outline', withInner = true }: Props) {
  const stroke =
    variant === 'gold'
      ? 'oklch(0.74 0.085 75)'
      : variant === 'filled'
        ? 'currentColor'
        : 'currentColor';
  return (
    <svg viewBox="0 0 120 160" fill="none" className={cn('block', className)} aria-hidden="true">
      <title>Acampamento Santa Rita — arco</title>
      {/* outer arch */}
      <path
        d="M 8 158 L 8 60 A 52 52 0 0 1 112 60 L 112 158"
        stroke={stroke}
        strokeWidth={variant === 'filled' ? 0 : 1.4}
        fill={variant === 'filled' ? stroke : 'none'}
        strokeLinecap="round"
      />
      {withInner && (
        <>
          {/* inner threshold */}
          <path
            d="M 28 158 L 28 70 A 32 32 0 0 1 92 70 L 92 158"
            stroke={stroke}
            strokeWidth={1}
            opacity={0.55}
            fill="none"
          />
          {/* keystone dot */}
          <circle cx={60} cy={20} r={1.5} fill={stroke} opacity={0.7} />
          {/* base line */}
          <line x1={6} x2={114} y1={158} y2={158} stroke={stroke} strokeWidth={1.2} opacity={0.7} />
        </>
      )}
    </svg>
  );
}

// Pequeno glifo decorativo — para títulos e separadores.
export function ArchGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('inline-block', className)}
      aria-hidden="true"
    >
      <title>Glifo arco</title>
      <path
        d="M 4 22 L 4 12 A 8 8 0 0 1 20 12 L 20 22"
        stroke="currentColor"
        strokeWidth={1.4}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={12} cy={4} r={0.8} fill="currentColor" />
    </svg>
  );
}
