import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/pdv/contas')({
  component: PdvContas,
});

function PdvContas() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">PDV — Contas abertas</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: contas abertas no(s) evento(s) em andamento. Saldo, status,
            ação "fechar" (gera invoice). */}
      </p>
    </div>
  );
}
