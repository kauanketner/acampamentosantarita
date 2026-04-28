import { cn } from '@/lib/cn';
import Image from 'next/image';

type Props = {
  className?: string;
  /** Lado em px. A logo é quadrada (665×644 ≈ 1:1). */
  size?: number;
  /** Em fundos escuros, encapsula num círculo paper pra logo respirar. */
  framed?: boolean;
  priority?: boolean;
};

/**
 * Logo oficial do Acampamento Santa Rita — brasão circular com tenda,
 * sol, pinheiros, cruzes e rosas (Caieiras-SP). Mesmo asset usado no app.
 */
export function Logomark({ className, size = 36, framed, priority }: Props) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center shrink-0',
        framed &&
          'rounded-full bg-(color:--color-paper) border border-(color:--color-rule) p-1.5',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="Acampamento Santa Rita"
        width={size}
        height={size}
        priority={priority}
        className="size-full object-contain select-none"
        draggable={false}
      />
    </span>
  );
}

/**
 * Wordmark tipográfico — usado quando se quer reforçar o nome em serif italic
 * em vez de exibir o brasão (ex.: footer, brindes). A logo PNG já contém o
 * nome, então use esse componente seletivamente, não junto com Logomark.
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
