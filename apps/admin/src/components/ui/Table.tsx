import type * as React from 'react';
import { cn } from '@/lib/cn';

export function Table({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-(--radius-lg) border border-(color:--color-border) bg-(color:--color-surface) overflow-hidden',
        className,
      )}
    >
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-(color:--color-surface-2)/60 border-b border-(color:--color-border)">
      {children}
    </thead>
  );
}

export function TH({
  children,
  className,
  align = 'left',
}: {
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.18em] text-(color:--color-muted-foreground) font-medium',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-(color:--color-border) last:border-b-0',
        'transition-colors duration-100',
        onClick && 'cursor-pointer',
        'hover:bg-(color:--color-surface-2)/40',
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TD({
  children,
  className,
  align = 'left',
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        'px-4 py-3 align-top text-sm',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </td>
  );
}
