import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '@/lib/cn';

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
));
RadioGroup.displayName = 'RadioGroup';

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square size-5 rounded-full border border-(color:--color-border-strong)',
      'bg-(color:--color-surface) data-[state=checked]:border-(color:--color-primary) data-[state=checked]:bg-(color:--color-primary)',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-ring)',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
      <span className="block size-2 rounded-full bg-(color:--color-primary-foreground)" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';

export const RadioCard = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { value: string; checked?: boolean }
>(({ className, value, checked, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'flex items-start gap-3 p-4 rounded-(--radius-md) border cursor-pointer',
        'transition-colors',
        checked
          ? 'border-(color:--color-primary) bg-(color:--color-primary-soft)'
          : 'border-(color:--color-border-strong) bg-(color:--color-surface) hover:bg-(color:--color-muted)',
        className,
      )}
      {...props}
    >
      <RadioGroupItem value={value} className="mt-0.5" />
      <div className="flex-1">{children}</div>
    </label>
  );
});
RadioCard.displayName = 'RadioCard';
