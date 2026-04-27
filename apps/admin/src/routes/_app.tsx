import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export const Route = createFileRoute('/_app')({
  // TODO: beforeLoad guard — redirecionar pra /login se não autenticado.
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
