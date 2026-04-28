import { cn } from '@/lib/cn';
import * as React from 'react';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'plain' | 'warmth' | 'outline' }
>(({ className, variant = 'warmth', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-(--radius-lg) overflow-hidden',
        variant === 'warmth' && 'surface-warmth border border-(color:--color-border)',
        variant === 'outline' &&
          'border border-(color:--color-border-strong) bg-(color:--color-surface)',
        variant === 'plain' && 'bg-(color:--color-surface)',
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-5 pt-5 pb-3', className)} {...props} />
);

export const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-5 pb-5', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'px-5 py-3.5 border-t border-(color:--color-border) bg-(color:--color-surface-elevated)',
      className,
    )}
    {...props}
  />
);
