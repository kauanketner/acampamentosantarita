import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 select-none',
    'font-medium tracking-tight whitespace-nowrap',
    'transition-[transform,box-shadow,background-color,color] duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(color:--color-background)',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.985]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-(color:--color-primary) text-(color:--color-primary-foreground)',
          'shadow-[0_1px_0_oklch(1_0_0_/_0.18)_inset,0_8px_22px_-12px_oklch(0.42_0.09_45_/_0.6)]',
          'hover:brightness-110',
        ],
        ghost: [
          'bg-transparent text-(color:--color-foreground)',
          'hover:bg-(color:--color-muted)',
        ],
        outline: [
          'bg-(color:--color-surface) text-(color:--color-foreground)',
          'border border-(color:--color-border-strong)',
          'hover:bg-(color:--color-muted)',
        ],
        soft: [
          'bg-(color:--color-primary-soft) text-(color:--color-primary)',
          'hover:brightness-95 dark:hover:brightness-110',
        ],
        gold: [
          'gold-leaf text-(color:--color-accent-foreground)',
          'shadow-[0_1px_0_oklch(1_0_0_/_0.4)_inset,0_8px_22px_-12px_oklch(0.5_0.08_60_/_0.7)]',
          'hover:brightness-105',
        ],
        link: [
          'bg-transparent text-(color:--color-primary) underline-offset-4',
          'hover:underline',
        ],
        destructive: [
          'bg-(color:--color-destructive) text-(color:--color-destructive-foreground)',
          'hover:brightness-110',
        ],
      },
      size: {
        sm: 'h-9 px-3.5 text-sm rounded-(--radius-pill)',
        md: 'h-11 px-5 text-[15px] rounded-(--radius-pill)',
        lg: 'h-14 px-7 text-base rounded-(--radius-pill)',
        icon: 'size-10 rounded-full',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant, size, block, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, block, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
