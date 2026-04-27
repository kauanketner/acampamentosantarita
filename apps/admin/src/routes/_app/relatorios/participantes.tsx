import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/relatorios/participantes')({
  component: RelatoriosParticipantes,
});

function RelatoriosParticipantes() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Relatório — Participantes</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: GET /v1/reports/participants-by-event. Cortes: 1ª vez vs veteranos,
            campistas vs equipistas, faixa etária, cidade, sexo. */}
      </p>
    </div>
  );
}
