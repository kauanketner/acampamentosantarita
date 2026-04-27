import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from 'sonner';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <div className="relative z-10">
        <Outlet />
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          unstyled: false,
          classNames: {
            toast:
              'rounded-(--radius-md) border border-(color:--color-border-strong) bg-(color:--color-surface) text-(color:--color-foreground) font-sans shadow-xl',
          },
        }}
      />
    </>
  );
}
