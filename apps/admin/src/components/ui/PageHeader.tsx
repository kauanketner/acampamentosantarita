import { cn } from '@/lib/cn';
import { Link, type LinkProps } from '@tanstack/react-router';
import type * as React from 'react';

type BackTo =
  | React.ReactNode
  | { label: string; to: LinkProps['to']; params?: Record<string, string> };

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Pre-rendered back element (e.g. a Link). */
  back?: React.ReactNode;
  /** Convenience: object form rendered as a back link. */
  backTo?: BackTo;
  className?: string;
};

/**
 * Header litúrgico-editorial: eyebrow em mono caixa-alta, título serif
 * grande, descrição refinada, slot de ações à direita.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
  backTo,
  className,
}: Props) {
  const backNode = back ?? renderBackTo(backTo);
  return (
    <header className={cn('space-y-2', className)}>
      {backNode}
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
              {eyebrow}
            </p>
          )}
          <h1
            className="font-display text-[clamp(1.75rem,3.2vw,2.4rem)] leading-[1.05] tracking-[-0.02em] text-balance max-w-3xl"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-[14px] text-(color:--color-muted-foreground) max-w-2xl text-pretty leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

function renderBackTo(backTo: BackTo | undefined): React.ReactNode {
  if (!backTo) return null;
  if (typeof backTo === 'object' && backTo !== null && 'label' in backTo && 'to' in backTo) {
    return (
      <Link
        // biome-ignore lint/suspicious/noExplicitAny: dynamic to/params
        to={backTo.to as any}
        // biome-ignore lint/suspicious/noExplicitAny: dynamic params
        params={backTo.params as any}
        className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.18em] text-(color:--color-muted-foreground) hover:text-(color:--color-foreground) transition-colors"
      >
        <span aria-hidden>←</span>
        {backTo.label}
      </Link>
    );
  }
  return backTo;
}
