import { cn } from '@/lib/cn';
import * as React from 'react';

const baseClass =
  'block w-full rounded-(--radius-md) bg-(color:--color-surface) text-(color:--color-foreground) ' +
  'border border-(color:--color-border-strong) px-3 h-9 text-sm ' +
  'placeholder:text-(color:--color-subtle) ' +
  'transition-[border-color,box-shadow] duration-150 ' +
  'focus:outline-none focus:border-(color:--color-primary) focus:ring-2 focus:ring-(color:--color-primary)/20 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(baseClass, className)} {...props} />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(baseClass.replace('h-9', 'min-h-24 py-2 leading-relaxed'), className)}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(baseClass, 'pr-8 appearance-none', className)}
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3e%3cpath d='M3 4.5L6 7.5L9 4.5' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.65rem center',
      backgroundSize: '12px 12px',
      ...(props.style ?? {}),
    }}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

type FieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function Field({ label, hint, required, error, children, className }: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="text-[11px] uppercase tracking-[0.06em] font-medium text-(color:--color-muted-foreground)">
        {label}
        {required && <span className="text-(color:--color-danger) ml-0.5">*</span>}
      </span>
      {hint && (
        <span className="block text-[11px] text-(color:--color-subtle) mt-0.5 normal-case tracking-normal">
          {hint}
        </span>
      )}
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-[11px] text-(color:--color-danger)">{error}</p>}
    </label>
  );
}
