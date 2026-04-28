import { BottomNav } from '@/components/shell/BottomNav';
import { useSession } from '@/lib/auth';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const { data: session, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate({ to: '/login', replace: true });
    }
  }, [isLoading, session, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="size-6 rounded-full border-2 border-(color:--color-primary) border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    // Em transição para /login — não renderiza conteúdo autenticado
    return null;
  }

  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
