import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '@/lib/cn';

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'inline-flex h-7 w-12 shrink-0 items-center rounded-full',
      'bg-(color:--color-muted) data-[state=checked]:bg-(color:--color-primary)',
      'transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-ring)',
      'disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block size-6 rounded-full bg-white shadow-md',
        'translate-x-0.5 data-[state=checked]:translate-x-[22px]',
        'transition-transform duration-200',
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';
