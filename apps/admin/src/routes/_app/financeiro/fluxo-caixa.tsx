import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/financeiro/fluxo-caixa')({
  component: FluxoCaixa,
});

// O fluxo de caixa de fato (gráfico mensal + saldo por status + recentes)
// vive em /relatorios/financeiro. Aqui mantemos um atalho.
function FluxoCaixa() {
  return (
    <div className="p-6 max-w-3xl space-y-4">
      <h1 className="font-serif text-2xl">Fluxo de caixa</h1>
      <div className="rounded-lg border bg-card p-5 space-y-2">
        <p className="text-sm">
          O relatório consolidado (receita mensal, saldo por status de fatura,
          movimentação dos últimos 30 dias) está em{' '}
          <Link
            to="/relatorios/financeiro"
            className="text-primary underline"
          >
            Relatórios → Financeiro
          </Link>
          .
        </p>
        <p className="text-xs text-muted-foreground">
          Quando a integração com Asaas estiver ativa, esta tela vai consolidar
          também as taxas e saldos em conta.
        </p>
      </div>
    </div>
  );
}
