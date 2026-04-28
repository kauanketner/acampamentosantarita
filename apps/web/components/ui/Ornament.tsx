import { cn } from '@/lib/cn';

type Variant = 'flower' | 'cross' | 'star' | 'diamond';

const Glyph = ({ variant }: { variant: Variant }) => {
  switch (variant) {
    case 'cross':
      return (
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
          <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
          <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor" />
        </svg>
      );
    case 'diamond':
      return (
        <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
          <rect
            x="6"
            y="2"
            width="5.66"
            height="5.66"
            rx="0.5"
            transform="rotate(45 6 2)"
            fill="currentColor"
          />
        </svg>
      );
    default:
      // flower / pétala — 6 pétalas em volta de um ponto
      return (
        <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
          <g fill="currentColor">
            <ellipse cx="8" cy="3" rx="1" ry="2.5" />
            <ellipse cx="8" cy="13" rx="1" ry="2.5" />
            <ellipse cx="3" cy="8" rx="2.5" ry="1" />
            <ellipse cx="13" cy="8" rx="2.5" ry="1" />
            <ellipse cx="4.5" cy="4.5" rx="1.6" ry="1" transform="rotate(45 4.5 4.5)" />
            <ellipse cx="11.5" cy="11.5" rx="1.6" ry="1" transform="rotate(45 11.5 11.5)" />
            <ellipse cx="11.5" cy="4.5" rx="1.6" ry="1" transform="rotate(-45 11.5 4.5)" />
            <ellipse cx="4.5" cy="11.5" rx="1.6" ry="1" transform="rotate(-45 4.5 11.5)" />
            <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          </g>
        </svg>
      );
  }
};

type Props = {
  variant?: Variant;
  className?: string;
  /** Sem linhas em volta — só o glifo */
  glyphOnly?: boolean;
};

export function Ornament({ variant = 'flower', className, glyphOnly }: Props) {
  if (glyphOnly) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center text-(color:--color-accent-deep)',
          className,
        )}
      >
        <Glyph variant={variant} />
      </span>
    );
  }
  return (
    <div className={cn('ornament text-(color:--color-rule-strong)', className)}>
      <span className="text-(color:--color-accent-deep)">
        <Glyph variant={variant} />
      </span>
    </div>
  );
}
