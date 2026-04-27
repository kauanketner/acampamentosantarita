import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/$id/equipes')({
  component: EventoEquipes,
});

function EventoEquipes() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Equipes de Serviço</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: alocar equipistas por equipe (cozinha, bem-estar, ...).
            Funções: coordenador, vice, membro. */}
      </p>
    </div>
  );
}
