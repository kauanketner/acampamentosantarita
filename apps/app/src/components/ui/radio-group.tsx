import { cn } from '@/lib/cn';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

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
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    value: string;
    checked?: boolean;
    /**
     * "row" (default) — radio à esquerda, conteúdo à direita. Bom para
     * descrições longas em coluna única ou duas colunas.
     * "stacked" — radio em cima, conteúdo embaixo, centralizado. Ideal
     * para 3+ colunas com rótulos curtos no mobile.
     */
    layout?: 'row' | 'stacked';
  }
>(({ className, value, checked, children, layout = 'row', ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'rounded-(--radius-md) border cursor-pointer transition-colors min-w-0',
        layout === 'row'
          ? 'flex items-start gap-3 p-4'
          : 'flex flex-col items-center gap-2 px-2 py-3 text-center',
        checked
          ? 'border-(color:--color-primary) bg-(color:--color-primary-soft)'
          : 'border-(color:--color-border-strong) bg-(color:--color-surface) hover:bg-(color:--color-muted)',
        className,
      )}
      {...props}
    >
      <RadioGroupItem value={value} className={layout === 'row' ? 'mt-0.5' : 'shrink-0'} />
      <div className={cn(layout === 'row' && 'flex-1 min-w-0')}>{children}</div>
    </label>
  );
});
RadioCard.displayName = 'RadioCard';
