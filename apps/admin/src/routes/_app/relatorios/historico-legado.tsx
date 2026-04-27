import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/relatorios/historico-legado')({
  component: RelatoriosHistoricoLegado,
});

function RelatoriosHistoricoLegado() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Relatório — Histórico Legado</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: GET /v1/reports/legacy-history. Distribuição das participações
            declaradas (1º a 13º acampamentos): quantos veteranos por edição,
            tribos legadas mais citadas, lacunas de cadastro. */}
      </p>
    </div>
  );
}
