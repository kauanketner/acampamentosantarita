import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/financeiro/faturas')({
  component: Faturas,
});

function Faturas() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Faturas</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: lista de invoices (registration/pos/shop/other). Filtros por status,
            período, pessoa, evento. Ações: gerar cobrança Asaas, registrar dinheiro,
            cancelar, ver pagamentos. */}
      </p>
    </div>
  );
}
