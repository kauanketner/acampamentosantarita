import * as React from 'react';
import { Drawer } from 'vaul';
import { cn } from '@/lib/cn';

export const Sheet = Drawer.Root;
export const SheetTrigger = Drawer.Trigger;
export const SheetClose = Drawer.Close;
export const SheetPortal = Drawer.Portal;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Drawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof Drawer.Overlay>
>(({ className, ...props }, ref) => (
  <Drawer.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-(color:--color-foreground)/40 backdrop-blur-sm', className)}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof Drawer.Content>,
  React.ComponentPropsWithoutRef<typeof Drawer.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Drawer.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[92vh] flex-col rounded-t-(--radius-xl)',
        'bg-(color:--color-surface) border-t border-(color:--color-border)',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-3 mb-1 h-1 w-12 rounded-full bg-(color:--color-border-strong)" />
      {children}
    </Drawer.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof Drawer.Title>,
  React.ComponentPropsWithoutRef<typeof Drawer.Title>
>(({ className, ...props }, ref) => (
  <Drawer.Title
    ref={ref}
    className={cn('font-display text-2xl tracking-tight px-6 pt-3 pb-1', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof Drawer.Description>,
  React.ComponentPropsWithoutRef<typeof Drawer.Description>
>(({ className, ...props }, ref) => (
  <Drawer.Description
    ref={ref}
    className={cn('text-sm text-(color:--color-muted-foreground) px-6 pb-2', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';
