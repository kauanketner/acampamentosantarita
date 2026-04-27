import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { EventForm } from '@/components/forms/EventForm';
import { ApiError } from '@/lib/api';
import { useCreateEvent } from '@/lib/queries/events';

export const Route = createFileRoute('/_app/eventos/novo')({
  component: NovoEvento,
});

function NovoEvento() {
  const navigate = useNavigate();
  const create = useCreateEvent();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Eventos
        </p>
        <h1 className="font-serif text-2xl mt-1">Novo evento</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comece em rascunho. Você pode abrir inscrições quando estiver pronto.
        </p>
      </header>

      <EventForm
        submitLabel="Criar evento"
        submitting={create.isPending}
        errorMessage={error}
        onSubmit={async (input) => {
          setError(null);
          try {
            const created = await create.mutateAsync(input);
            navigate({ to: '/eventos/$id', params: { id: created.id } });
          } catch (err) {
            setError(
              err instanceof ApiError
                ? err.message
                : 'Não foi possível criar o evento.',
            );
          }
        }}
        onCancel={() => navigate({ to: '/eventos' })}
      />
    </div>
  );
}
