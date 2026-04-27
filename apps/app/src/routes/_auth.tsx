import { Outlet, createFileRoute } from '@tanstack/react-router';
import { BottomNav } from '@/components/shell/BottomNav';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
