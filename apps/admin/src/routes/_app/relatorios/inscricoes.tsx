import { useRegistrationsReport } from '@/lib/queries/reports';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/relatorios/inscricoes')({
  component: RelatoriosInscricoes,
});

const statusLabel: Record<string, string> = {
  pendente: 'Pendentes',
  aprovada: 'Aprovadas',
  confirmada: 'Confirmadas',
  em_espera: 'Em espera',
  cancelada: 'Canceladas',
  rejeitada: 'Rejeitadas',
};

function RelatoriosInscricoes() {
  const { data, isLoading } = useRegistrationsReport();
  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Relatório — Inscrições</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão consolidada por status e por evento.
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && (
        <>
          <section className="rounded-lg border bg-card p-5 space-y-3">
            <h2 className="font-serif text-lg">Por status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {data.byStatus.map((s) => (
                <div key={s.status} className="rounded-md border bg-background p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {statusLabel[s.status] ?? s.status}
                  </p>
                  <p className="font-serif text-2xl mt-1 tabular-nums">{s.total}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5 space-y-3">
            <h2 className="font-serif text-lg">Por evento</h2>
            {data.byEvent.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem inscrições.</p>
            ) : (
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                      <th className="px-4 py-2 font-medium">Evento</th>
                      <th className="px-4 py-2 font-medium text-right">Total</th>
                      <th className="px-4 py-2 font-medium text-right">Aprovadas</th>
                      <th className="px-4 py-2 font-medium text-right">Pendentes</th>
                      <th className="px-4 py-2 font-medium text-right">Canceladas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byEvent.map((e) => (
                      <tr key={e.eventId} className="border-b last:border-b-0">
                        <td className="px-4 py-2 font-medium">{e.eventName}</td>
                        <td className="px-4 py-2 text-right font-mono">{e.total}</td>
                        <td className="px-4 py-2 text-right font-mono text-emerald-700 dark:text-emerald-400">
                          {e.approved}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-amber-700 dark:text-amber-400">
                          {e.pending}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-muted-foreground">
                          {e.canceled}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
