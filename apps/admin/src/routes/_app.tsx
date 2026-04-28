import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { isAdminRole, useSession } from '@/lib/auth';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { data: session, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return;
    if (!session || !isAdminRole(session.user.role)) {
      navigate({ to: '/login', replace: true });
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-(color:--color-muted-foreground)">
        Carregando…
      </div>
    );
  }

  if (!session || !isAdminRole(session.user.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-(color:--color-background) text-(color:--color-foreground)">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
