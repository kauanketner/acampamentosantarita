import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/relatorios/financeiro')({
  component: RelatoriosFinanceiro,
});

function RelatoriosFinanceiro() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Relatório — Financeiro</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: GET /v1/reports/finance. Receita por evento, inadimplência,
            métodos de pagamento, reembolsos. */}
      </p>
    </div>
  );
}
