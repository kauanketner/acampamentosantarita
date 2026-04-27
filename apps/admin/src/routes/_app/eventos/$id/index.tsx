import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { CustomQuestionsManager } from '@/components/forms/CustomQuestionsManager';
import { EventForm } from '@/components/forms/EventForm';
import { ApiError } from '@/lib/api';
import { brl, formatDateRange } from '@/lib/format';
import {
  useAdminEvent,
  useAdminEvents,
  useDeleteEvent,
  useUpdateEvent,
} from '@/lib/queries/events';

export const Route = createFileRoute('/_app/eventos/$id/')({
  component: EventoVisaoGeral,
});

function EventoVisaoGeral() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, isError } = useAdminEvent(id);
  const { data: events } = useAdminEvents();
  const update = useUpdateEvent(id);
  const remove = useDeleteEvent();
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const adminRow = events?.find((e) => e.id === id);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  }
  if (isError || !event) {
    return (
      <div className="p-6">
        <p className="font-serif text-2xl">Evento não encontrado.</p>
        <Link to="/eventos" className="text-sm text-primary underline mt-2 inline-block">
          Voltar pra lista
        </Link>
      </div>
    );
  }

  const onDelete = async () => {
    try {
      await remove.mutateAsync(id);
      navigate({ to: '/eventos' });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível excluir.',
      );
    }
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <header className="space-y-2">
        <Link
          to="/eventos"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Eventos
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl">{event.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDateRange(event.startDate, event.endDate)}
              {event.location ? ` · ${event.location}` : ''}
            </p>
          </div>
          {adminRow && (
            <Link
              to="/eventos/$id/inscricoes"
              params={{ id }}
              className="text-right rounded-md border bg-card p-3 hover:bg-secondary/50 transition"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Inscrições
              </p>
              <p className="font-mono text-2xl">{adminRow.registrationCount}</p>
              {adminRow.pendingCount > 0 && (
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {adminRow.pendingCount} pendentes →
                </p>
              )}
            </Link>
          )}
        </div>
      </header>

      {savedAt && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700 p-3 text-sm text-emerald-900 dark:text-emerald-200">
          Salvo. As mudanças aparecem no app dos campistas no próximo refresh.
        </div>
      )}

      <EventForm
        initial={event}
        submitLabel="Salvar alterações"
        submitting={update.isPending}
        errorMessage={error}
        onSubmit={async (input) => {
          setError(null);
          try {
            await update.mutateAsync(input);
            setSavedAt(Date.now());
            setTimeout(() => setSavedAt(null), 3000);
          } catch (err) {
            setError(
              err instanceof ApiError ? err.message : 'Não foi possível salvar.',
            );
          }
        }}
      />

      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="font-serif text-lg">Perguntas customizadas</h2>
        <p className="text-sm text-muted-foreground">
          Perguntas que aparecem no formulário de inscrição. Você define se elas
          aparecem para campistas, equipistas ou ambos.
        </p>
        <CustomQuestionsManager eventId={id} />
      </section>

      {event.priceCampista && event.priceEquipista && (
        <section className="rounded-lg border bg-card p-5">
          <h2 className="font-serif text-lg mb-3">Resumo financeiro</h2>
          <p className="text-sm text-muted-foreground">
            Campista:{' '}
            <span className="font-mono">{brl(Number(event.priceCampista))}</span>
            {' · '}
            Equipista:{' '}
            <span className="font-mono">{brl(Number(event.priceEquipista))}</span>
          </p>
        </section>
      )}

      <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 space-y-3">
        <h2 className="font-serif text-lg text-destructive">Zona perigosa</h2>
        <p className="text-sm text-muted-foreground">
          Excluir o evento o esconde do app e do site. Inscrições já feitas continuam
          armazenadas para histórico, mas o evento some das listas.
        </p>
        {!confirmingDelete ? (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="rounded-md border border-destructive/40 text-destructive px-4 py-2 text-sm hover:bg-destructive/10"
          >
            Excluir evento
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onDelete}
              disabled={remove.isPending}
              className="rounded-md bg-destructive text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {remove.isPending ? 'Excluindo…' : 'Confirmar exclusão'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="text-sm text-muted-foreground underline"
            >
              Cancelar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
