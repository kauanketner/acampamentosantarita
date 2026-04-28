import { cn } from '@/lib/cn';
import { useRouter } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import type * as React from 'react';

type Props = {
  title?: string;
  back?: boolean | string;
  trailing?: React.ReactNode;
  border?: boolean;
  className?: string;
};

export function TopBar({ title, back = false, trailing, border = false, className }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof back === 'string') {
      router.navigate({ to: back });
    } else {
      router.history.back();
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 safe-top',
        'bg-(color:--color-background)/85 backdrop-blur-md',
        border && 'border-b border-(color:--color-border)',
        className,
      )}
    >
      <div className="h-14 flex items-center px-3">
        {back ? (
          <button
            type="button"
            onClick={handleBack}
            className="size-10 -ml-1 inline-flex items-center justify-center rounded-full hover:bg-(color:--color-muted) active:scale-95 transition"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
        ) : (
          <span className="size-10 -ml-1" aria-hidden />
        )}
        <h1 className="flex-1 text-center text-[15px] font-medium tracking-tight truncate px-2">
          {title}
        </h1>
        <div className="size-10 -mr-1 inline-flex items-center justify-center">{trailing}</div>
      </div>
    </header>
  );
}
