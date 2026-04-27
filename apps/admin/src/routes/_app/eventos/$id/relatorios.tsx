import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/$id/relatorios')({
  component: EventoRelatorios,
});

function EventoRelatorios() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Relatórios do evento</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: presença, financeiro, distribuição por tribo/equipe, alergias e
            restrições (resumo agregado para a cozinha), idade média, listas para impressão. */}
      </p>
    </div>
  );
}
