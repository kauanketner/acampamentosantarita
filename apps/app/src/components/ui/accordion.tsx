import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/cn';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-(color:--color-border) last:border-b-0', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-start justify-between gap-3 py-5 text-left text-[15px] font-medium leading-snug',
        'transition-colors hover:text-(color:--color-primary)',
        '[&[data-state=open]>svg]:rotate-45',
        className,
      )}
      {...props}
    >
      {children}
      <Plus
        className="size-5 shrink-0 mt-0.5 text-(color:--color-muted-foreground) transition-transform duration-300"
        strokeWidth={1.5}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-[15px] text-(color:--color-muted-foreground) leading-relaxed',
      'data-[state=open]:animate-[scene-in_0.4s_var(--ease-soft)]',
    )}
    {...props}
  >
    <div className={cn('pb-5 pr-8', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';
