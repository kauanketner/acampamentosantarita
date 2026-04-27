import { Link } from '@tanstack/react-router';

const tabs = [
  { to: '/', label: 'Início' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/financeiro', label: 'Financeiro' },
  { to: '/avisos', label: 'Avisos' },
  { to: '/perfil', label: 'Perfil' },
];

export function BottomNav() {
  // TODO: ícones (Home, CalendarDays, Wallet, Bell, User) e badges de contagem
  // (avisos não lidos, faturas vencendo).
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {tabs.map((t) => (
          <li key={t.to}>
            <Link
              to={t.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
              activeProps={{ className: 'text-primary font-medium' }}
            >
              <span className="size-5 rounded-full bg-secondary" aria-hidden />
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
