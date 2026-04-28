import { brl } from '@/lib/format';
import { useAdminEvent } from '@/lib/queries/events';
import { usePosAccounts } from '@/lib/queries/pos';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_app/eventos/$id/pdv')({
  component: EventoPdv,
});

function EventoPdv() {
  const { id } = Route.useParams();
  const { data: event } = useAdminEvent(id);
  const { data: accounts, isLoading } = usePosAccounts({ eventId: id });

  const stats = useMemo(() => {
    const acc = { count: 0, open: 0, totalOpen: 0, totalAll: 0 };
    for (const a of accounts ?? []) {
      acc.count += 1;
      const t = Number(a.totalAmount);
      acc.totalAll += t;
      if (a.status === 'aberta') {
        acc.open += 1;
        acc.totalOpen += t;
      }
    }
    return acc;
  }, [accounts]);

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
        <h1 className="font-serif text-2xl">PDV deste evento</h1>
        <p className="text-sm text-muted-foreground">
          Visão consolidada das contas (cantina/lojinha) deste evento. Pra gerenciar lançamentos e
          fechar contas, vá em{' '}
          <Link to="/pdv/contas" className="text-primary underline">
            PDV — Contas
          </Link>
          .
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {accounts && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Stat label="Contas (total)" value={stats.count} />
            <Stat label="Em aberto" value={stats.open} tone="amber" />
            <Stat label="Saldo total acumulado" value={brl(stats.totalAll)} tone="green" />
          </div>

          {accounts.length === 0 ? (
            <div className="rounded-md border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
              Sem contas neste evento. Abra a primeira em{' '}
              <Link to="/pdv/contas" className="text-primary underline">
                PDV — Contas
              </Link>
              .
            </div>
          ) : (
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                    <th className="px-4 py-2 font-medium">Pessoa</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium text-right">Saldo</th>
                    <th className="px-4 py-2 font-medium text-right">Aberta em</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((a) => (
                    <tr key={a.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                      <td className="px-4 py-2 font-medium">{a.person.fullName}</td>
                      <td className="px-4 py-2 text-xs capitalize">{a.status}</td>
                      <td className="px-4 py-2 text-right font-mono">
                        {brl(Number(a.totalAmount))}
                      </td>
                      <td className="px-4 py-2 text-right text-xs text-muted-foreground">
                        {new Date(a.openedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
  tone?: 'neutral' | 'amber' | 'green';
}) {
  const ring: Record<typeof tone, string> = {
    neutral: 'border-border',
    amber: 'border-amber-300 dark:border-amber-800',
    green: 'border-emerald-300 dark:border-emerald-800',
  };
  return (
    <div className={`rounded-lg border bg-card p-4 ${ring[tone]}`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-serif text-2xl mt-1 tabular-nums">{value}</p>
    </div>
  );
}
