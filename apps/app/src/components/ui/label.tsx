import { cn } from '@/lib/cn';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'block text-sm font-medium tracking-tight text-(color:--color-foreground) mb-1.5',
      className,
    )}
    {...props}
  />
));
Label.displayName = 'Label';
