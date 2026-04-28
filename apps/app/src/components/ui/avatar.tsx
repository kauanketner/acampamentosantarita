import { cn } from '@/lib/cn';

type Props = {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ringed?: boolean;
  className?: string;
};

const sizeMap = {
  sm: 'size-9 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-16 text-base',
  xl: 'size-24 text-2xl',
};

function initials(name?: string) {
  if (!name) return '·';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');
}

export function Avatar({ src, name, size = 'md', ringed, className }: Props) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0',
        'bg-(color:--color-primary-soft) text-(color:--color-primary) font-display',
        sizeMap[size],
        ringed &&
          'ring-2 ring-offset-2 ring-(color:--color-accent) ring-offset-(color:--color-background)',
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name ?? 'avatar'} className="size-full object-cover" />
      ) : (
        <span style={{ fontVariationSettings: "'opsz' 144" }}>{initials(name)}</span>
      )}
    </div>
  );
}
