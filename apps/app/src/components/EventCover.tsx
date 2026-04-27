import { ArchMotif } from '@/components/motif/arch';
import { cn } from '@/lib/cn';

type Props = {
  /** Pares de cor pro fundo gradiente (fallback quando não há imagem). */
  gradient: [string, string];
  /** URL da imagem de capa. Sobrescreve o gradient quando presente. */
  imageUrl?: string | null;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  withMotif?: boolean;
  children?: React.ReactNode;
  className?: string;
};

const heightMap = {
  sm: 'h-32',
  md: 'h-44',
  lg: 'h-56',
  xl: 'h-[26rem]',
};

export function EventCover({
  gradient,
  imageUrl,
  height = 'md',
  withMotif = true,
  children,
  className,
}: Props) {
  const hasImage = !!imageUrl;
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-(--radius-lg)',
        heightMap[height],
        className,
      )}
      style={{
        backgroundImage: hasImage
          ? `url("${imageUrl}")`
          : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* grain overlay (sutil quando há foto) */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 mix-blend-overlay pointer-events-none',
          hasImage ? 'opacity-15' : 'opacity-30',
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
      {/* darken bottom for text legibility */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent pointer-events-none',
          hasImage ? 'from-black/55' : 'from-black/35',
        )}
      />
      {/* arch motif as embossed signature */}
      {withMotif && (
        <div className="absolute -bottom-8 -right-4 text-white/12 pointer-events-none">
          <ArchMotif className="w-32 h-44" withInner />
        </div>
      )}
      {children}
    </div>
  );
}
