import { brl, formatDate } from '@/lib/format';
import { useAdminEvent } from '@/lib/queries/events';
import { useEventRegistrations } from '@/lib/queries/registrations';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_app/eventos/$id/relatorios')({
  component: EventoRelatorios,
});

function EventoRelatorios() {
  const { id } = Route.useParams();
  const { data: event } = useAdminEvent(id);
  const { data: regs, isLoading } = useEventRegistrations(id);

  const stats = useMemo(() => {
    const acc = {
      total: 0,
      campistas: 0,
      equipistas: 0,
      pendente: 0,
      aprovada: 0,
      confirmada: 0,
      attended: 0,
      revenue: 0,
    };
    for (const r of regs ?? []) {
      acc.total += 1;
      if (r.roleIntent === 'campista') acc.campistas += 1;
      if (r.roleIntent === 'equipista') acc.equipistas += 1;
      if (r.status === 'pendente') acc.pendente += 1;
      if (r.status === 'aprovada') acc.aprovada += 1;
      if (r.status === 'confirmada') acc.confirmada += 1;
      if (r.attended) acc.attended += 1;
      if (r.paymentStatus === 'pago' && r.priceAmount) {
        acc.revenue += Number(r.priceAmount);
      }
    }
    return acc;
  }, [regs]);

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header className="space-y-2">
        <Link
          to="/eventos/$id"
          params={{ id }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← {event?.name ?? 'Evento'}
        </Link>
        <h1 className="font-serif text-2xl">Relatórios do evento</h1>
        {event && (
          <p className="text-sm text-muted-foreground">
            {formatDate(event.startDate)} → {formatDate(event.endDate)}
            {event.location && ` · ${event.location}`}
          </p>
        )}
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {regs && (
        <>
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Inscritos" value={stats.total} />
            <Stat label="Campistas" value={stats.campistas} tone="sky" />
            <Stat label="Equipistas" value={stats.equipistas} tone="amber" />
            <Stat label="Confirmados" value={stats.confirmada} tone="green" />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Stat label="Pendentes de aprovação" value={stats.pendente} tone="amber" />
            <Stat label="Presentes (check-in)" value={stats.attended} tone="green" />
            <Stat label="Receita confirmada" value={brl(stats.revenue)} tone="green" />
          </section>

          <section className="rounded-lg border bg-card p-5 space-y-2">
            <h2 className="font-serif text-lg">Atalhos do evento</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link
                to="/eventos/$id/inscricoes"
                params={{ id }}
                className="rounded-md border px-3 py-1 hover:bg-secondary"
              >
                Lista de inscrições
              </Link>
              <Link
                to="/eventos/$id/tribos"
                params={{ id }}
                className="rounded-md border px-3 py-1 hover:bg-secondary"
              >
                Tribos
              </Link>
              <Link
                to="/eventos/$id/equipes"
                params={{ id }}
                className="rounded-md border px-3 py-1 hover:bg-secondary"
              >
                Equipes
              </Link>
              <Link
                to="/eventos/$id/pdv"
                params={{ id }}
                className="rounded-md border px-3 py-1 hover:bg-secondary"
              >
                PDV
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: number | string;
  tone?: 'neutral' | 'amber' | 'green' | 'sky';
}) {
  const ring: Record<typeof tone, string> = {
    neutral: 'border-border',
    amber: 'border-amber-300 dark:border-amber-800',
    green: 'border-emerald-300 dark:border-emerald-800',
    sky: 'border-sky-300 dark:border-sky-800',
  };
  return (
    <div className={`rounded-lg border bg-card p-4 ${ring[tone]}`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-serif text-2xl mt-1 tabular-nums">{value}</p>
    </div>
  );
}
