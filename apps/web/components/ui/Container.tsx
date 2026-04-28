import { cn } from '@/lib/cn';
import type * as React from 'react';

type Width = 'reading' | 'editorial' | 'wide' | 'full';

const widthClass: Record<Width, string> = {
  reading: 'max-w-[640px]', // text-only, ~70 char measure
  editorial: 'max-w-[1100px]', // magazine reading
  wide: 'max-w-[1320px]', // hero, gallery mosaics
  full: 'max-w-none',
};

type Props = {
  width?: Width;
  className?: string;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Container({ width = 'editorial', className, children, as: Tag = 'div' }: Props) {
  return (
    <Tag className={cn('mx-auto px-6 sm:px-8 lg:px-10', widthClass[width], className)}>
      {children}
    </Tag>
  );
}
