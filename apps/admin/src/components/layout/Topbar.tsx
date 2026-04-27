import { useNavigate } from '@tanstack/react-router';
import { roleLabel, useLogout, useSession } from '@/lib/auth';
import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const logout = useLogout();

  const fullName = session?.person?.fullName ?? '';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const onLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate({ to: '/login', replace: true }),
    });
  };

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {session && (
          <div className="flex items-center gap-3 pl-3 border-l">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight">
                {fullName || session.user.email || session.user.phone}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {roleLabel(session.user.role)}
              </p>
            </div>
            <div className="size-9 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center text-sm font-medium">
              {initials || '·'}
            </div>
            <button
              type="button"
              onClick={onLogout}
              disabled={logout.isPending}
              className="text-xs text-muted-foreground hover:text-foreground underline disabled:opacity-50"
            >
              {logout.isPending ? 'Saindo…' : 'Sair'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
