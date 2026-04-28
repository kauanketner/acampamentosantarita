import { formatDateRange } from '@/lib/format';
import { type AdminEvent, useAdminEvents } from '@/lib/queries/events';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_app/tribos/')({
  component: TribosIndex,
});

function TribosIndex() {
  const { data: events, isLoading } = useAdminEvents();

  const acampamentos = useMemo(
    () => (events ?? []).filter((e) => e.type === 'acampamento'),
    [events],
  );

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <header>
        <h1 className="font-serif text-2xl">Tribos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acesse a gestão de tribos por acampamento. Cada acampamento numerado tem suas próprias
          tribos.
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {events && acampamentos.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhum acampamento cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            As tribos vivem dentro de acampamentos numerados. Crie um acampamento primeiro.
          </p>
          <Link
            to="/eventos/novo"
            className="inline-block mt-4 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Novo acampamento
          </Link>
        </div>
      )}

      {acampamentos.length > 0 && (
        <div className="space-y-2">
          {acampamentos.map((e) => (
            <EventLink key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventLink({ event }: { event: AdminEvent }) {
  return (
    <Link
      to="/eventos/$id/tribos"
      params={{ id: event.id }}
      className="block rounded-lg border bg-card p-4 hover:bg-secondary/50 transition"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-medium leading-tight">
            {event.editionNumber ? `${event.editionNumber}º · ` : ''}
            {event.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDateRange(event.startDate, event.endDate)}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">→</span>
      </div>
    </Link>
  );
}
