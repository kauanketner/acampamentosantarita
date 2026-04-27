import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/financeiro/fluxo-caixa')({
  component: FluxoCaixa,
});

function FluxoCaixa() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Fluxo de caixa</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: GET /v1/finance/reports/cashflow. Gráfico (entradas por método,
            por período) e tabela detalhada. */}
      </p>
    </div>
  );
}
