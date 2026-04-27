import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1">
        {/* TODO: breadcrumb baseado em useMatchRoute, busca global, atalhos. */}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {/* TODO: avatar do usuário + dropdown (perfil, logout). */}
      </div>
    </header>
  );
}
