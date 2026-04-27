import { Outlet, createFileRoute } from '@tanstack/react-router';
import { BottomNav } from '@/components/layout/BottomNav';

export const Route = createFileRoute('/_auth')({
  // TODO: beforeLoad guard:
  // 1) sem sessão → redirect /login
  // 2) sem profile_completed_at → redirect /cadastro
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
