import { cn } from '@/lib/cn';
import type * as React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'soft' | 'ghost';
};

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  default: 'bg-(color:--color-surface) border border-(color:--color-border)',
  soft: 'bg-(color:--color-surface-2) border border-(color:--color-border)',
  ghost: 'border border-dashed border-(color:--color-border-strong)',
};

export function Card({ className, variant = 'default', children, ...props }: Props) {
  return (
    <div
      className={cn('rounded-(--radius-lg) overflow-hidden', variantClass[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 py-4 border-b border-(color:--color-border)', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-3 border-t border-(color:--color-border) bg-(color:--color-surface-2)',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  className?: string;
};

/** Cabeçalho elegante pra seções dentro de páginas. */
export function SectionTitle({
  eyebrow,
  title,
  description,
  trailing,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4 flex-wrap mb-3', className)}>
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground) mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-lg leading-tight tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs text-(color:--color-muted-foreground) mt-1 max-w-xl">
            {description}
          </p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
