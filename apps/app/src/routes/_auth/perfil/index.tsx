import { Link, createFileRoute } from '@tanstack/react-router';
import {
  Bell,
  ChevronRight,
  Heart,
  History,
  LogOut,
  Sparkles,
  Stethoscope,
  User,
} from 'lucide-react';
import { Page } from '@/components/shell/Page';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { me } from '@/mock/data';

export const Route = createFileRoute('/_auth/perfil/')({
  component: PerfilIndex,
});

const items = [
  { to: '/perfil/editar' as const, label: 'Dados pessoais', Icon: User, hint: 'Nome, endereço, contatos' },
  { to: '/perfil/saude' as const, label: 'Saúde', Icon: Stethoscope, hint: 'Revisada há 14 dias' },
  { to: '/perfil/fe' as const, label: 'Vida de fé', Icon: Heart, hint: '3 sacramentos' },
  {
    to: '/perfil/historico' as const,
    label: 'Histórico de acampamentos',
    Icon: History,
    hint: '4 participações',
  },
  {
    to: '/perfil/notificacoes' as const,
    label: 'Notificações',
    Icon: Bell,
    hint: 'Push e e-mail',
  },
];

function PerfilIndex() {
  return (
    <Page>
      <div className="safe-top" />

      {/* Hero — avatar + nome */}
      <header className="px-5 pt-12 pb-6 text-center">
        <Avatar name={me.fullName} size="xl" ringed={me.isVeteran} className="mx-auto mb-4" />
        <h1
          className="font-display text-[clamp(2rem,9vw,2.6rem)] leading-[1] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {me.fullName}
        </h1>
        <p className="text-sm text-(color:--color-muted-foreground) mt-2">
          {me.city}/{me.state}
        </p>
        <div className="mt-3 inline-flex items-center gap-2">
          <Badge tone="primary">
            <Sparkles className="size-3" /> Veterana — {me.campCount} acampamentos
          </Badge>
        </div>
      </header>

      <Separator variant="ornament" className="mx-6 mb-2" />

      {/* Items */}
      <ul className="px-5 grid gap-2">
        {items.map((i) => (
          <li key={i.to}>
            <Link
              to={i.to}
              className="surface-warmth flex items-center gap-3 rounded-(--radius-md) border border-(color:--color-border) p-4 transition active:scale-[0.99]"
            >
              <div className="size-10 rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) inline-flex items-center justify-center shrink-0">
                <i.Icon className="size-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium leading-tight">{i.label}</p>
                <p className="text-xs text-(color:--color-muted-foreground) mt-0.5">{i.hint}</p>
              </div>
              <ChevronRight className="size-4 text-(color:--color-muted-foreground)" strokeWidth={1.5} />
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="px-5 mt-8 mb-6 text-center">
        <Button variant="ghost" size="md" className="text-(color:--color-destructive)">
          <LogOut className="size-4" /> Sair
        </Button>
        <p className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-subtle) mt-6">
          v0.0.1 · Comunidade Santa Rita
        </p>
      </div>
    </Page>
  );
}
