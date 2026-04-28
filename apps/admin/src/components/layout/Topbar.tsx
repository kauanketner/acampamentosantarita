import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { roleLabel, useLogout, useSession } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  const fullName = session?.person?.fullName ?? '';
  const initials =
    fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '·';

  const onLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate({ to: '/login', replace: true }),
    });
  };

  return (
    <header
      className={cn(
        'h-14 sticky top-0 z-10',
        'bg-(color:--color-background)/85 backdrop-blur-md',
        'border-b border-(color:--color-border)',
        'flex items-center justify-between gap-4 px-6',
      )}
    >
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {session && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
              }}
              className={cn(
                'flex items-center gap-2.5 pl-1 pr-2 h-9 rounded-full',
                'border border-(color:--color-border)',
                'hover:bg-(color:--color-surface-2) transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(color:--color-primary)/35',
              )}
              aria-haspopup="true"
              aria-expanded={open}
            >
              <span className="size-7 rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) inline-flex items-center justify-center text-[11px] font-medium">
                {initials}
              </span>
              <span className="text-left hidden md:block leading-tight">
                <p className="text-[12px] font-medium">
                  {fullName || session.user.email || session.user.phone}
                </p>
                <p className="text-[10px] text-(color:--color-muted-foreground)">
                  {roleLabel(session.user.role)}
                </p>
              </span>
              <svg
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
                className={cn(
                  'size-3 text-(color:--color-muted-foreground) transition-transform duration-150',
                  open && 'rotate-180',
                )}
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {open && (
              <div
                role="menu"
                className={cn(
                  'absolute right-0 top-[calc(100%+8px)] w-72 z-50',
                  'rounded-(--radius-lg) border border-(color:--color-border)',
                  'bg-(color:--color-surface) shadow-2xl shadow-black/10',
                  'animate-fade-up',
                )}
              >
                <div className="p-4 border-b border-(color:--color-border)">
                  <p className="font-display text-base leading-tight tracking-tight">{fullName}</p>
                  <p className="text-[11px] text-(color:--color-muted-foreground) mt-1">
                    {session.user.email ?? session.user.phone}
                  </p>
                  <Badge tone="primary" className="mt-2">
                    {roleLabel(session.user.role)}
                  </Badge>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    block
                    size="sm"
                    onClick={onLogout}
                    disabled={logout.isPending}
                    className="!justify-start"
                  >
                    {logout.isPending ? 'Saindo…' : 'Sair'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
