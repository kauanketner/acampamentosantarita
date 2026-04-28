import { cn } from '@/lib/cn';
import * as React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  asChild?: boolean;
};

const sizeClass: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
};

const variantClass: Record<Variant, string> = {
  primary:
    'bg-(color:--color-primary) text-(color:--color-primary-foreground) hover:bg-(color:--color-primary-hover) shadow-[inset_0_-1px_0_color-mix(in_oklch,_black_15%,_transparent)] disabled:opacity-50',
  secondary:
    'bg-(color:--color-surface) text-(color:--color-foreground) border border-(color:--color-border-strong) hover:bg-(color:--color-surface-2) disabled:opacity-50',
  ghost:
    'bg-transparent text-(color:--color-muted-foreground) hover:bg-(color:--color-surface-2) hover:text-(color:--color-foreground) disabled:opacity-50',
  danger:
    'bg-(color:--color-danger) text-white hover:bg-(color:--color-danger)/90 disabled:opacity-50',
  'danger-ghost':
    'bg-transparent text-(color:--color-danger) hover:bg-(color:--color-danger)/10 disabled:opacity-50',
  link: 'bg-transparent text-(color:--color-primary) hover:underline underline-offset-2 px-0',
};

const baseClass =
  'inline-flex items-center justify-center rounded-(--radius-md) font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-primary)/35 focus-visible:ring-offset-2 focus-visible:ring-offset-(color:--color-background) disabled:cursor-not-allowed';

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', block, asChild, className, children, ...props }, ref) => {
    const classes = cn(
      baseClass,
      sizeClass[size],
      variantClass[variant],
      block && 'w-full',
      className,
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button ref={ref} type={props.type ?? 'button'} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
