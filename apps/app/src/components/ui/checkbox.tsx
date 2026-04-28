import { cn } from '@/lib/cn';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer size-5 shrink-0 rounded-sm border border-(color:--color-border-strong)',
      'bg-(color:--color-surface) data-[state=checked]:bg-(color:--color-primary) data-[state=checked]:border-(color:--color-primary)',
      'transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-ring) focus-visible:ring-offset-1',
      'disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-(color:--color-primary-foreground)">
      <Check className="size-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';
