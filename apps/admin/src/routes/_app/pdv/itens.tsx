import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/pdv/itens')({
  component: PdvItens,
});

function PdvItens() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">PDV — Itens</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: catálogo do PDV (cantina/lojinha/outros). CRUD com preço, SKU,
            estoque opcional, ativo/inativo. */}
      </p>
    </div>
  );
}
