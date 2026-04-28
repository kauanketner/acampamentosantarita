import { cn } from '@/lib/cn';
import type * as React from 'react';

type Props = {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
};

export function Field({ label, hint, error, optional, htmlFor, className, children }: Props) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-3 text-sm font-medium tracking-tight text-(color:--color-foreground)">
          <div className="flex-1 min-w-0">
            {typeof label === 'string' ? (
              <label htmlFor={htmlFor} className="block">
                {label}
              </label>
            ) : (
              label
            )}
          </div>
          {optional && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-subtle) shrink-0">
              opcional
            </span>
          )}
        </div>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-(color:--color-muted-foreground) leading-snug">{hint}</p>
      )}
      {error && <p className="text-xs text-(color:--color-destructive) leading-snug">{error}</p>}
    </div>
  );
}

type RowProps = {
  children: React.ReactNode;
  className?: string;
};
export function FieldRow({ children, className }: RowProps) {
  return <div className={cn('grid gap-3 grid-cols-2', className)}>{children}</div>;
}
