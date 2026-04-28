import { cn } from '@/lib/cn';
import { useState } from 'react';

type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** When true, render with a subtle frame (useful on header/footer). */
  framed?: boolean;
};

const sizeMap = {
  xs: 'size-7',
  sm: 'size-12',
  md: 'size-20',
  lg: 'size-32',
  xl: 'size-44',
};

// Logo oficial — Acampamento Santa Rita / Caieiras-SP.
// Salve a arte em apps/app/public/logo.png (idealmente também logo.svg).
// Enquanto não estiver disponível, mostramos um fallback discreto.
export function Logo({ size = 'md', className, framed }: Props) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        sizeMap[size],
        framed &&
          'rounded-full bg-(color:--color-surface) border border-(color:--color-border) p-2',
        className,
      )}
    >
      {errored ? (
        <LogoFallback />
      ) : (
        <img
          src="/logo.png"
          alt="Acampamento Santa Rita"
          className="size-full object-contain"
          draggable={false}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}

// Símbolo de espera enquanto o PNG da logo não está em /public.
function LogoFallback() {
  return (
    <div className="size-full rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) flex flex-col items-center justify-center text-center px-2">
      <span
        className="font-display text-[clamp(0.55rem,2.4vw,0.7rem)] uppercase tracking-[0.2em] leading-tight"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
      >
        Santa
        <br />
        Rita
      </span>
    </div>
  );
}
