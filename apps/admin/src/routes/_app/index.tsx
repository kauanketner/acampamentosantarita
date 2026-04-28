import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { useSession } from '@/lib/auth';
import { brl, formatDateRange } from '@/lib/format';
import { useAdminEvents } from '@/lib/queries/events';
import { usePendingRegistrations } from '@/lib/queries/registrations';
import { useDashboardKPIs } from '@/lib/queries/reports';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session } = useSession();
  const { data: events } = useAdminEvents();
  const { data: kpis } = useDashboardKPIs();
  const { data: pending } = usePendingRegistrations();
  const navigate = useNavigate();

  const firstName = session?.person?.fullName.split(' ').filter(Boolean)[0] ?? '';

  const next = events?.find(
    (e) =>
      e.status === 'inscricoes_abertas' ||
      e.status === 'inscricoes_fechadas' ||
      e.status === 'em_andamento',
  );

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return 'Madrugada serena';
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  })();

  return (
    <div className="px-8 py-8 max-w-7xl space-y-8">
      <PageHeader
        eyebrow={`${greeting} · Painel administrativo`}
        title={
          <>
            Olá
            {firstName && (
              <>
                ,{' '}
                <span
                  className="font-display italic"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
                >
                  {firstName}
                </span>
              </>
            )}
            .
          </>
        }
        description={
          (kpis?.pendingRegistrations ?? 0) > 0
            ? `${kpis?.pendingRegistrations} ${kpis?.pendingRegistrations === 1 ? 'inscrição aguardando' : 'inscrições aguardando'} aprovação. Cuide com calma — cada nome é uma alma.`
            : 'Tudo em dia. Nenhuma inscrição pendente no momento.'
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label="Pessoas cadastradas"
          value={kpis?.personsTotal ?? '—'}
          tone="primary"
          onClick={() => navigate({ to: '/pessoas' })}
        />
        <Stat
          label="Eventos ativos"
          value={kpis?.activeEvents ?? '—'}
          hint={`de ${kpis?.eventsTotal ?? '—'} no total`}
          tone="info"
          onClick={() => navigate({ to: '/eventos' })}
        />
        <Stat
          label="Inscrições pendentes"
          value={kpis?.pendingRegistrations ?? '—'}
          tone={kpis && kpis.pendingRegistrations > 0 ? 'warning' : 'neutral'}
          onClick={() => navigate({ to: '/inscricoes' })}
        />
        <Stat
          label="Faturas em aberto"
          value={brl(Number(kpis?.openInvoicesAmount ?? 0))}
          hint={`${kpis?.openInvoicesCount ?? '—'} ${kpis?.openInvoicesCount === 1 ? 'fatura' : 'faturas'}`}
          tone={kpis && Number(kpis.openInvoicesAmount) > 0 ? 'warning' : 'success'}
          onClick={() => navigate({ to: '/financeiro/faturas' })}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {next ? (
            <NextEventCard event={next} />
          ) : (
            <Card>
              <CardBody>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                  Próximo evento
                </p>
                <p className="text-sm text-(color:--color-muted-foreground) mt-3">
                  Nenhum evento ativo agora. Crie um em{' '}
                  <Link to="/eventos/novo" className="text-(color:--color-primary) underline">
                    Eventos → Novo
                  </Link>
                  .
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardBody className="space-y-3">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                  Triagem rápida
                </p>
                <Link
                  to="/inscricoes"
                  className="text-[11px] text-(color:--color-primary) hover:underline"
                >
                  Ver tudo
                </Link>
              </div>
              {pending && pending.length === 0 ? (
                <p className="text-sm text-(color:--color-muted-foreground)">Nenhuma pendente 🌿</p>
              ) : (
                <ul className="space-y-2.5">
                  {(pending ?? []).slice(0, 4).map((r) => (
                    <li key={r.id} className="text-sm">
                      <Link
                        to="/eventos/$id/inscricoes"
                        params={{ id: r.event.id }}
                        className="block hover:bg-(color:--color-surface-2)/40 -mx-2 px-2 py-1.5 rounded-(--radius-sm) transition-colors"
                      >
                        <p className="font-medium leading-tight">{r.person.fullName}</p>
                        <p className="text-[11px] text-(color:--color-muted-foreground) mt-0.5">
                          {r.event.name} · {r.roleIntent}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}

function NextEventCard({
  event,
}: {
  event: NonNullable<ReturnType<typeof useAdminEvents>['data']>[number];
}) {
  const statusInfo: Record<
    typeof event.status,
    { label: string; tone: 'success' | 'warning' | 'info' | 'neutral' }
  > = {
    rascunho: { label: 'Rascunho', tone: 'neutral' },
    inscricoes_abertas: { label: 'Inscrições abertas', tone: 'success' },
    inscricoes_fechadas: { label: 'Inscrições fechadas', tone: 'warning' },
    em_andamento: { label: 'Acontecendo agora', tone: 'info' },
    finalizado: { label: 'Finalizado', tone: 'neutral' },
    cancelado: { label: 'Cancelado', tone: 'neutral' },
  };
  const status = statusInfo[event.status];

  return (
    <Card className="relative">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-(color:--color-primary)" />
      <CardBody className="space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
              Próximo evento
            </p>
            <Link to="/eventos/$id" params={{ id: event.id }} className="block mt-2 group">
              <h2
                className="font-display text-2xl tracking-tight leading-tight group-hover:text-(color:--color-primary) transition-colors"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
              >
                {event.name}
              </h2>
              <p className="text-sm text-(color:--color-muted-foreground) mt-1">
                {formatDateRange(event.startDate, event.endDate)}
                {event.location && ` · ${event.location}`}
              </p>
            </Link>
          </div>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-(color:--color-border)">
          <Mini
            label="Inscritos"
            value={event.registrationCount}
            hint={event.pendingCount > 0 ? `${event.pendingCount} pendentes` : undefined}
          />
          <Mini label="Aprovados" value={event.approvedCount} />
          <Mini label="Vagas" value={event.maxParticipants ?? '∞'} />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to="/eventos/$id/inscricoes"
            params={{ id: event.id }}
            className="text-[12px] text-(color:--color-primary) hover:underline"
          >
            Inscrições →
          </Link>
          <span className="text-(color:--color-subtle)">·</span>
          <Link
            to="/eventos/$id/tribos"
            params={{ id: event.id }}
            className="text-[12px] text-(color:--color-primary) hover:underline"
          >
            Tribos →
          </Link>
          <span className="text-(color:--color-subtle)">·</span>
          <Link
            to="/eventos/$id/equipes"
            params={{ id: event.id }}
            className="text-[12px] text-(color:--color-primary) hover:underline"
          >
            Equipes →
          </Link>
          <span className="text-(color:--color-subtle)">·</span>
          <Link
            to="/eventos/$id/relatorios"
            params={{ id: event.id }}
            className="text-[12px] text-(color:--color-primary) hover:underline"
          >
            Relatórios →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

function Mini({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-(color:--color-muted-foreground)">
        {label}
      </p>
      <p
        className="font-display text-xl tracking-tight tabular-nums mt-0.5"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
      >
        {value}
      </p>
      {hint && <p className="text-[10px] text-(color:--color-warning) mt-0.5">{hint}</p>}
    </div>
  );
}
