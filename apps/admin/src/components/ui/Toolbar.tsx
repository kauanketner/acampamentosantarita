import { cn } from '@/lib/cn';
import type * as React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Linha de filtros + busca + ação primária. Mantém respiro consistente
 * em todas as páginas de listagem.
 */
export function Toolbar({ children, className }: Props) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', '[&>*]:shrink-0', className)}>
      {children}
    </div>
  );
}

export function ToolbarSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex-1 min-w-[220px]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(color:--color-subtle)"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 20L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Buscar…'}
        className={cn(
          'h-9 w-full rounded-(--radius-md) bg-(color:--color-surface)',
          'border border-(color:--color-border-strong) pl-9 pr-3 text-sm',
          'placeholder:text-(color:--color-subtle)',
          'focus:outline-none focus:border-(color:--color-primary) focus:ring-2 focus:ring-(color:--color-primary)/20',
        )}
      />
    </div>
  );
}
