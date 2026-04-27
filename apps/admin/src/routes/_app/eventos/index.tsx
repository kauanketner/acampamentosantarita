import { Link, createFileRoute } from '@tanstack/react-router';
import { type AdminEvent, useAdminEvents } from '@/lib/queries/events';
import { formatDateRange } from '@/lib/format';

export const Route = createFileRoute('/_app/eventos/')({
  component: EventosIndex,
});

const typeLabel: Record<AdminEvent['type'], string> = {
  acampamento: 'Acampamento',
  retiro: 'Retiro',
  encontro: 'Encontro',
  formacao: 'Formação',
  outro: 'Evento',
};

const statusInfo: Record<
  AdminEvent['status'],
  { label: string; tone: 'neutral' | 'green' | 'amber' | 'red' }
> = {
  rascunho: { label: 'Rascunho', tone: 'neutral' },
  inscricoes_abertas: { label: 'Inscrições abertas', tone: 'green' },
  inscricoes_fechadas: { label: 'Inscrições fechadas', tone: 'amber' },
  em_andamento: { label: 'Em andamento', tone: 'amber' },
  finalizado: { label: 'Finalizado', tone: 'neutral' },
  cancelado: { label: 'Cancelado', tone: 'red' },
};

const toneClass: Record<'neutral' | 'green' | 'amber' | 'red', string> = {
  neutral: 'bg-secondary text-secondary-foreground border-border',
  green:
    'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
  amber:
    'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  red:
    'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
};

function EventosIndex() {
  const { data: events, isLoading, isError } = useAdminEvents();

  return (
    <div className="p-6 space-y-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">Eventos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acampamentos, retiros, encontros e formações.
          </p>
        </div>
        <Link
          to="/eventos/novo"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Novo evento
        </Link>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar os eventos. Tente recarregar.
        </div>
      )}

      {events && events.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhum evento ainda</p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            Quando você criar o primeiro evento, ele aparece aqui — e vira disponível
            no app dos campistas.
          </p>
          <Link
            to="/eventos/novo"
            className="inline-block mt-4 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Criar primeiro evento
          </Link>
        </div>
      )}

      {events && events.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-3 font-medium">Evento</th>
                <th className="px-4 py-3 font-medium">Datas</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Inscrições</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const status = statusInfo[e.status];
                return (
                  <tr
                    key={e.id}
                    className="border-b last:border-b-0 hover:bg-secondary/30 transition"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to="/eventos/$id"
                        params={{ id: e.id }}
                        className="block"
                      >
                        <p className="font-medium leading-tight">{e.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {typeLabel[e.type]}
                          {e.editionNumber ? ` · ${e.editionNumber}º` : ''}
                          {e.location ? ` · ${e.location}` : ''}
                        </p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDateRange(e.startDate, e.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass[status.tone]}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-mono">{e.registrationCount}</span>
                      {e.pendingCount > 0 && (
                        <span className="ml-2 text-amber-700 dark:text-amber-400 text-xs">
                          {e.pendingCount} pendentes
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
