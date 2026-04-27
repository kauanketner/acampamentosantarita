import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/relatorios/inscricoes')({
  component: RelatoriosInscricoes,
});

function RelatoriosInscricoes() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Relatório — Inscrições</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: GET /v1/reports/registrations. Séries temporais, distribuição por
            evento/papel/status, exportação CSV/PDF. */}
      </p>
    </div>
  );
}
