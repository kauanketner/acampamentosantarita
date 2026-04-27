import { Link, createFileRoute } from '@tanstack/react-router';
import { useSession } from '@/lib/auth';
import { useAdminEvents } from '@/lib/queries/events';
import { formatDateRange } from '@/lib/format';

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session } = useSession();
  const { data: events } = useAdminEvents();
  const firstName = session?.person?.fullName.split(' ').filter(Boolean)[0] ?? '';

  const eventsCount = events?.length ?? 0;
  const openRegistrations = events?.filter(
    (e) => e.status === 'inscricoes_abertas',
  ).length ?? 0;
  const pendingTotal = events?.reduce((acc, e) => acc + e.pendingCount, 0) ?? 0;
  const next = events?.find(
    (e) =>
      e.status === 'inscricoes_abertas' ||
      e.status === 'inscricoes_fechadas' ||
      e.status === 'em_andamento',
  );

  return (
    <div className="p-6 space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Painel administrativo
        </p>
        <h1 className="font-serif text-3xl">
          Olá{firstName ? `, ${firstName}` : ''}.
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingTotal > 0
            ? `${pendingTotal} ${pendingTotal === 1 ? 'inscrição aguardando' : 'inscrições aguardando'} sua aprovação.`
            : 'Nenhuma inscrição pendente no momento.'}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Eventos cadastrados" value={eventsCount} to="/eventos" />
        <Stat
          label="Inscrições abertas agora"
          value={openRegistrations}
          to="/eventos"
        />
        <Stat label="Pendentes de aprovação" value={pendingTotal} to="/inscricoes" />
      </div>

      {next && (
        <div className="rounded-lg border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Próximo evento
          </p>
          <Link
            to="/eventos/$id"
            params={{ id: next.id }}
            className="block mt-1.5"
          >
            <p className="font-serif text-2xl tracking-tight">{next.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDateRange(next.startDate, next.endDate)}
              {next.location ? ` · ${next.location}` : ''}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {next.registrationCount} {next.registrationCount === 1 ? 'inscrição' : 'inscrições'}
              {next.pendingCount > 0 && ` · ${next.pendingCount} pendentes`}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  to,
}: {
  label: string;
  value: number;
  to: '/eventos' | '/inscricoes';
}) {
  return (
    <Link
      to={to}
      className="block rounded-lg border bg-card p-5 hover:bg-secondary/50 transition"
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-serif text-3xl tracking-tight mt-1.5">{value}</p>
    </Link>
  );
}
