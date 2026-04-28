import { Link, createFileRoute } from '@tanstack/react-router';
import { formatDate } from '@/lib/format';
import { useParticipantsByEvent } from '@/lib/queries/reports';

export const Route = createFileRoute('/_app/relatorios/participantes')({
  component: RelatoriosParticipantes,
});

function RelatoriosParticipantes() {
  const { data, isLoading } = useParticipantsByEvent();
  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Relatório — Participantes por evento</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Distribuição de campistas e equipistas em cada evento.
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum evento.</p>
      )}

      {data && data.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-2 font-medium">Evento</th>
                <th className="px-4 py-2 font-medium">Quando</th>
                <th className="px-4 py-2 font-medium text-right">Total</th>
                <th className="px-4 py-2 font-medium text-right">Campistas</th>
                <th className="px-4 py-2 font-medium text-right">Equipistas</th>
                <th className="px-4 py-2 font-medium text-right">Confirmados</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e.eventId} className="border-b last:border-b-0">
                  <td className="px-4 py-2">
                    <Link
                      to="/eventos/$id"
                      params={{ id: e.eventId }}
                      className="font-medium hover:underline"
                    >
                      {e.eventName}
                    </Link>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {e.type}
                    </p>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {formatDate(e.startDate)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{e.total}</td>
                  <td className="px-4 py-2 text-right font-mono text-sky-700 dark:text-sky-400">
                    {e.campistas}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-amber-700 dark:text-amber-400">
                    {e.equipistas}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-emerald-700 dark:text-emerald-400">
                    {e.confirmed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
