import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/financeiro/reembolsos')({
  component: Reembolsos,
});

function Reembolsos() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reembolsos</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: lista de refunds com motivo e quem autorizou. Fluxo: pagamento →
            estorno (Asaas ou manual). */}
      </p>
    </div>
  );
}
