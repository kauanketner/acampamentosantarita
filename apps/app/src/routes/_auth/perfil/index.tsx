import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
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
import { useLogout, useSession } from '@/lib/auth';
import { mediaUrl, useFullProfile } from '@/lib/queries/profile';

export const Route = createFileRoute('/_auth/perfil/')({
  component: PerfilIndex,
});

function PerfilIndex() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { data: profile } = useFullProfile();
  const logout = useLogout();

  const person = profile?.person;
  const fullName = person?.fullName ?? session?.person?.fullName ?? '';
  const avatarSrc = mediaUrl(person?.avatarUrl ?? session?.person?.avatarUrl ?? null);
  const city = person?.city ?? session?.person?.city ?? null;
  const state = person?.state ?? session?.person?.state ?? null;
  const veteranCount = profile?.participations.length ?? 0;
  const isVeteran = veteranCount > 0;
  const sacramentCount = profile?.sacraments.length ?? 0;
  const lastReview = profile?.health
    ? (profile.health as { lastReviewedAt?: string | null }).lastReviewedAt ?? null
    : null;

  const items = [
    {
      to: '/perfil/editar' as const,
      label: 'Dados pessoais',
      Icon: User,
      hint: 'Nome, endereço, contatos',
    },
    {
      to: '/perfil/saude' as const,
      label: 'Saúde',
      Icon: Stethoscope,
      hint: lastReview
        ? `Revisada ${formatRelativeDays(lastReview)}`
        : 'Atualize quando puder',
    },
    {
      to: '/perfil/fe' as const,
      label: 'Vida de fé',
      Icon: Heart,
      hint: sacramentCount
        ? `${sacramentCount} ${sacramentCount === 1 ? 'sacramento' : 'sacramentos'}`
        : 'Comunidade e sacramentos',
    },
    {
      to: '/perfil/historico' as const,
      label: 'Histórico de acampamentos',
      Icon: History,
      hint: veteranCount
        ? `${veteranCount} ${veteranCount === 1 ? 'participação' : 'participações'}`
        : 'Sem participações registradas',
    },
    {
      to: '/perfil/notificacoes' as const,
      label: 'Notificações',
      Icon: Bell,
      hint: 'Push e e-mail',
    },
  ];

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate({ to: '/login', replace: true }),
    });
  };

  return (
    <Page>
      <div className="safe-top" />

      <header className="px-5 pt-12 pb-6 text-center">
        <Avatar
          src={avatarSrc}
          name={fullName}
          size="xl"
          ringed={isVeteran}
          className="mx-auto mb-4"
        />
        <h1
          className="font-display text-[clamp(2rem,9vw,2.6rem)] leading-[1] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {fullName || '—'}
        </h1>
        {(city || state) && (
          <p className="text-sm text-(color:--color-muted-foreground) mt-2">
            {[city, state].filter(Boolean).join('/')}
          </p>
        )}
        {isVeteran && (
          <div className="mt-3 inline-flex items-center gap-2">
            <Badge tone="primary">
              <Sparkles className="size-3" /> Veterano(a) — {veteranCount} acampamentos
            </Badge>
          </div>
        )}
      </header>

      <Separator variant="ornament" className="mx-6 mb-2" />

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
                <p className="text-xs text-(color:--color-muted-foreground) mt-0.5">
                  {i.hint}
                </p>
              </div>
              <ChevronRight
                className="size-4 text-(color:--color-muted-foreground)"
                strokeWidth={1.5}
              />
            </Link>
          </li>
        ))}
      </ul>

      <div className="px-5 mt-8 mb-6 text-center">
        <Button
          variant="ghost"
          size="md"
          className="text-(color:--color-destructive)"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <LogOut className="size-4" /> {logout.isPending ? 'Saindo…' : 'Sair'}
        </Button>
        <p className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-subtle) mt-6">
          v0.0.1 · Comunidade Santa Rita
        </p>
      </div>
    </Page>
  );
}

function formatRelativeDays(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months === 1) return 'há 1 mês';
  if (months < 12) return `há ${months} meses`;
  const years = Math.floor(months / 12);
  return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}
