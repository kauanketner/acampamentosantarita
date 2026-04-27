import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase',
  {
    variants: {
      tone: {
        neutral: 'bg-(color:--color-muted) text-(color:--color-muted-foreground)',
        primary: 'bg-(color:--color-primary-soft) text-(color:--color-primary)',
        accent: 'bg-(color:--color-accent-soft) text-(color:--color-accent-foreground)',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
        warning: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100',
        danger: 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100',
        mystery: 'bg-(color:--color-mystery)/10 text-(color:--color-mystery)',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

type Props = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: Props) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}
