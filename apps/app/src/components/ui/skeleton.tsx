import { cn } from '@/lib/cn';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-(--radius-md) bg-(color:--color-muted)',
        className,
      )}
      {...props}
    />
  );
}
