import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: KPIs (próximo evento, inscrições da semana, faturas vencendo, novos cadastros).
            GET /v1/reports/dashboard. */}
      </p>
    </div>
  );
}
