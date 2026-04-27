import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/$id/inscricoes')({
  component: EventoInscricoes,
});

function EventoInscricoes() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Inscrições do evento</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: tabela de inscritos com filtros (status, papel, pagamento).
            Ações em massa: aprovar/rejeitar, exportar lista, marcar presença. */}
      </p>
    </div>
  );
}
