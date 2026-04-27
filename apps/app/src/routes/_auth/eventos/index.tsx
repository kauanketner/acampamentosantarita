import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/eventos/')({
  component: EventosIndex,
});

function EventosIndex() {
  return (
    <div>
      <TopBar title="Eventos" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: lista de eventos (acampamentos, retiros, encontros, formações).
              Cada card: cover, nome, data, local, status de inscrição.
              CTA "Inscrever-se" quando event.status='inscricoes_abertas'. */}
        </p>
      </div>
    </div>
  );
}
