import { ArchMotif } from '@/components/motif/arch';
import { cn } from '@/lib/cn';

type Props = {
  gradient: [string, string];
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
  height = 'md',
  withMotif = true,
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-(--radius-lg)',
        heightMap[height],
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      {/* grain overlay */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
      {/* darken bottom for text legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/35 to-transparent pointer-events-none"
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
