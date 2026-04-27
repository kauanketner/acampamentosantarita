import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/')({
  component: EventosIndex,
});

function EventosIndex() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Eventos</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: tabela com colunas: nome, tipo, edição, datas, status, inscritos, ações.
            Filtros: tipo (acampamento/retiro/encontro/formacao/outro), status, ano.
            CTA "Novo evento" → wizard. */}
      </p>
    </div>
  );
}
