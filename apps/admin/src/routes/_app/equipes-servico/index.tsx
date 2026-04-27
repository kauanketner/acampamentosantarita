import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/equipes-servico/')({
  component: EquipesServicoIndex,
});

function EquipesServicoIndex() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Equipes de Serviço</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: catálogo das equipes (cozinha, bem-estar, ...). CRUD. As alocações
            por evento ficam em /eventos/:id/equipes. */}
      </p>
    </div>
  );
}
