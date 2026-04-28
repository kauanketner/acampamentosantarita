import { cn } from '@/lib/cn';
import Link from 'next/link';
import type * as React from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'gold';
type Size = 'sm' | 'md' | 'lg';

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-oxblood)/30 focus-visible:ring-offset-2 focus-visible:ring-offset-(color:--color-paper) disabled:opacity-50 disabled:cursor-not-allowed';

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-[12px]',
  md: 'h-10 px-5 text-[13px]',
  lg: 'h-12 px-7 text-[14px]',
};

const variantClass: Record<Variant, string> = {
  primary:
    'bg-(color:--color-oxblood) text-(color:--color-paper) hover:bg-(color:--color-oxblood-deep) shadow-[inset_0_-1px_0_color-mix(in_oklch,_black_18%,_transparent)]',
  gold: 'bg-(color:--color-gold) text-(color:--color-ink) hover:bg-(color:--color-gold-deep) shadow-[inset_0_-1px_0_color-mix(in_oklch,_black_15%,_transparent)]',
  outline:
    'border border-(color:--color-ink)/15 text-(color:--color-ink) hover:bg-(color:--color-ink)/5 hover:border-(color:--color-ink)/30',
  ghost: 'text-(color:--color-ink) hover:bg-(color:--color-ink)/5',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsLink = CommonProps & { href: string; external?: boolean };
type AsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type Props = AsLink | AsButton;

export function Button(props: Props) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const cls = cn(baseClass, sizeClass[size], variantClass[variant], className);

  if ('href' in props && props.href) {
    if (props.external) {
      return (
        <a href={props.href} target="_blank" rel="noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    href: _h,
    ...rest
  } = props as AsButton & { href?: undefined };
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
