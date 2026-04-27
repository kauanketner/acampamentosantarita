import { Camera, ImagePlus, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'avatar' | 'cover';

type Props = {
  /** Controlled current image URL (or undefined to show empty state). */
  value?: string | null;
  /** Called with the File when the user picks a new image, null when removed. */
  onChange?: (file: File | null) => void;
  variant?: Variant;
  /** Avatar size or aspect ratio for cover. */
  size?: 'md' | 'lg' | 'xl';
  /** Optional name for fallback initials on avatar. */
  name?: string;
  /** Optional descriptive helper text below the upload zone. */
  hint?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
};

const avatarSizeMap = {
  md: 'size-20',
  lg: 'size-28',
  xl: 'size-36',
};

const coverHeightMap = {
  md: 'h-40',
  lg: 'h-52',
  xl: 'h-64',
};

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export function PhotoUpload({
  value,
  onChange,
  variant = 'avatar',
  size = 'lg',
  name,
  hint,
  className,
  id,
  disabled,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalUrl, setInternalUrl] = React.useState<string | null>(value ?? null);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    setInternalUrl(value ?? null);
  }, [value]);

  // Garante URL.revokeObjectURL ao trocar/desmontar para evitar leak de memória.
  React.useEffect(() => {
    return () => {
      if (internalUrl?.startsWith('blob:')) URL.revokeObjectURL(internalUrl);
    };
  }, [internalUrl]);

  const handleFile = (file: File | null) => {
    setError(null);
    if (!file) {
      setInternalUrl(null);
      onChange?.(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Arquivo precisa ser uma imagem.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Imagem maior que 8MB. Tente reduzir.');
      return;
    }
    const url = URL.createObjectURL(file);
    setInternalUrl(url);
    onChange?.(file);
  };

  const onPick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = '';
    handleFile(null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const initials = (name ?? '·')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  if (variant === 'avatar') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <button
          id={id}
          type="button"
          onClick={onPick}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          disabled={disabled}
          aria-label={internalUrl ? 'Trocar foto' : 'Escolher foto'}
          className={cn(
            'relative rounded-full overflow-hidden shrink-0',
            'border-2 border-dashed transition',
            avatarSizeMap[size],
            dragOver
              ? 'border-(color:--color-primary) bg-(color:--color-primary-soft)'
              : internalUrl
                ? 'border-(color:--color-border-strong)'
                : 'border-(color:--color-border-strong) bg-(color:--color-muted)',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-ring) focus-visible:ring-offset-2',
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer hover:border-(color:--color-primary)',
          )}
        >
          {internalUrl ? (
            <img
              src={internalUrl}
              alt="Foto de perfil"
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full flex flex-col items-center justify-center text-(color:--color-muted-foreground)">
              {name ? (
                <span
                  className="font-display text-3xl text-(color:--color-primary)"
                  style={{ fontVariationSettings: "'opsz' 144" }}
                >
                  {initials}
                </span>
              ) : (
                <Camera className="size-6" strokeWidth={1.5} />
              )}
            </div>
          )}
          {/* Camera badge overlay when has value, plus or empty when no value */}
          <div
            className={cn(
              'absolute bottom-0 right-0 size-9 rounded-full inline-flex items-center justify-center shadow-md',
              'bg-(color:--color-primary) text-(color:--color-primary-foreground)',
              'border-2 border-(color:--color-background)',
            )}
          >
            <Camera className="size-4" strokeWidth={1.5} />
          </div>
          {internalUrl && !disabled && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-0 right-0 size-7 rounded-full inline-flex items-center justify-center bg-(color:--color-foreground)/80 text-white hover:bg-(color:--color-destructive) transition"
              aria-label="Remover foto"
            >
              <X className="size-3.5" strokeWidth={2} />
            </button>
          )}
        </button>
        <button
          type="button"
          onClick={onPick}
          disabled={disabled}
          className="text-sm text-(color:--color-muted-foreground) hover:text-(color:--color-primary) transition"
        >
          {internalUrl ? 'Trocar foto' : 'Escolher foto'}
        </button>
        {hint && !error && (
          <p className="text-xs text-(color:--color-muted-foreground) text-center max-w-xs">
            {hint}
          </p>
        )}
        {error && <p className="text-xs text-(color:--color-destructive)">{error}</p>}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          disabled={disabled}
        />
      </div>
    );
  }

  // cover variant
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        id={id}
        type="button"
        onClick={onPick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        disabled={disabled}
        aria-label={internalUrl ? 'Trocar imagem' : 'Escolher imagem'}
        className={cn(
          'relative w-full overflow-hidden rounded-(--radius-md)',
          'border-2 border-dashed transition group',
          coverHeightMap[size],
          dragOver
            ? 'border-(color:--color-primary) bg-(color:--color-primary-soft)'
            : internalUrl
              ? 'border-(color:--color-border-strong)'
              : 'border-(color:--color-border-strong) bg-(color:--color-muted)',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-ring) focus-visible:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer hover:border-(color:--color-primary)',
        )}
      >
        {internalUrl ? (
          <>
            <img
              src={internalUrl}
              alt="Imagem do evento"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
          </>
        ) : (
          <div className="size-full flex flex-col items-center justify-center text-(color:--color-muted-foreground) gap-2 px-6 text-center">
            <ImagePlus className="size-8" strokeWidth={1.5} />
            <p className="text-sm font-medium">Toque para escolher</p>
            <p className="text-xs">Ou arraste uma imagem aqui</p>
          </div>
        )}
        {internalUrl && !disabled && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-3 right-3 size-9 rounded-full inline-flex items-center justify-center bg-(color:--color-foreground)/70 text-white hover:bg-(color:--color-destructive) transition backdrop-blur-sm"
            aria-label="Remover imagem"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        )}
        {internalUrl && !disabled && (
          <div className="absolute bottom-3 right-3 size-9 rounded-full bg-(color:--color-foreground)/70 text-white inline-flex items-center justify-center backdrop-blur-sm">
            <Camera className="size-4" strokeWidth={1.5} />
          </div>
        )}
      </button>
      {hint && !error && (
        <p className="text-xs text-(color:--color-muted-foreground)">{hint}</p>
      )}
      {error && <p className="text-xs text-(color:--color-destructive)">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        disabled={disabled}
      />
    </div>
  );
}
