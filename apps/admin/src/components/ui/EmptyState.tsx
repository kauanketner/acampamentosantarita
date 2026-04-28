import type * as React from 'react';
import { cn } from '@/lib/cn';

type Props = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'rounded-(--radius-lg) border border-dashed border-(color:--color-border-strong) bg-(color:--color-surface)/50',
        'flex flex-col items-center text-center px-6 py-14 gap-3',
        className,
      )}
    >
      {icon && (
        <div className="text-(color:--color-subtle) opacity-60 size-9 mb-1">
          {icon}
        </div>
      )}
      <p className="font-display text-xl tracking-tight">{title}</p>
      {description && (
        <p className="text-sm text-(color:--color-muted-foreground) max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
