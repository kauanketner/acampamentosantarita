import { Link, useLocation } from '@tanstack/react-router';
import { Bell, CalendarDays, Home, User, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/cn';

type Tab = {
  to: string;
  label: string;
  Icon: typeof Home;
  match: (path: string) => boolean;
};

const tabs: Tab[] = [
  { to: '/', label: 'Início', Icon: Home, match: (p) => p === '/' },
  { to: '/eventos', label: 'Eventos', Icon: CalendarDays, match: (p) => p.startsWith('/eventos') },
  {
    to: '/financeiro',
    label: 'Financeiro',
    Icon: Wallet,
    match: (p) => p.startsWith('/financeiro'),
  },
  { to: '/avisos', label: 'Avisos', Icon: Bell, match: (p) => p.startsWith('/avisos') },
  { to: '/perfil', label: 'Perfil', Icon: User, match: (p) => p.startsWith('/perfil') },
];

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  const activeIdx = tabs.findIndex((t) => t.match(path));
  const safeIdx = activeIdx === -1 ? 0 : activeIdx;

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 safe-bottom safe-x',
        'border-t border-(color:--color-border)',
        'bg-(color:--color-surface-elevated)/92 backdrop-blur-xl',
      )}
      aria-label="Navegação principal"
    >
      <div className="relative grid grid-cols-5">
        {/* indicator pill — slides between tabs */}
        <motion.div
          className="absolute top-0 h-[2px] bg-(color:--color-primary) rounded-full pointer-events-none"
          initial={false}
          animate={{
            left: `${safeIdx * 20}%`,
            width: '20%',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
        {tabs.map((t, i) => {
          const isActive = i === safeIdx;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                'flex flex-col items-center justify-center gap-1 pt-2.5 pb-2.5',
                'text-[10px] tracking-wide uppercase font-medium',
                'transition-colors duration-200',
                isActive ? 'text-(color:--color-primary)' : 'text-(color:--color-subtle)',
                'active:scale-95 transition-transform',
              )}
            >
              <span className="relative inline-flex items-center justify-center size-7">
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-blob"
                    className="absolute inset-0 rounded-full bg-(color:--color-primary-soft)"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <t.Icon
                  className="size-[18px] relative"
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </span>
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
