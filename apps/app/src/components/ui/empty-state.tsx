import type * as React from 'react';
import { cn } from '@/lib/cn';

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center px-6 py-14 gap-3',
        className,
      )}
    >
      {icon && (
        <div className="text-(color:--color-subtle) opacity-60 mb-1" aria-hidden>
          {icon}
        </div>
      )}
      <p className="font-display text-xl text-(color:--color-foreground) tracking-tight">{title}</p>
      {description && (
        <p className="text-sm text-(color:--color-muted-foreground) max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
