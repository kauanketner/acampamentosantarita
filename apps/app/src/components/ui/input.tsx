import * as React from 'react';
import { cn } from '@/lib/cn';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-12 w-full px-4 text-[15px]',
          'bg-(color:--color-surface) text-(color:--color-foreground) placeholder:text-(color:--color-subtle)',
          'border rounded-(--radius-md)',
          'border-(color:--color-border-strong)',
          'transition-[border-color,box-shadow] duration-200',
          'focus:outline-none focus:border-(color:--color-primary) focus:ring-2 focus:ring-(color:--color-ring) focus:ring-offset-0',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          invalid && 'border-(color:--color-destructive)',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-24 w-full px-4 py-3 text-[15px] resize-none',
          'bg-(color:--color-surface) text-(color:--color-foreground) placeholder:text-(color:--color-subtle)',
          'border rounded-(--radius-md) border-(color:--color-border-strong)',
          'transition-[border-color,box-shadow] duration-200',
          'focus:outline-none focus:border-(color:--color-primary) focus:ring-2 focus:ring-(color:--color-ring)',
          'disabled:opacity-60',
          invalid && 'border-(color:--color-destructive)',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
