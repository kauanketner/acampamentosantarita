import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/inscricoes/')({
  component: InscricoesIndex,
});

function InscricoesIndex() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Inscrições</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: visão global de todas as inscrições com filtros cruzados (evento,
            status, papel, pagamento, período). Útil para tesouraria e secretaria. */}
      </p>
    </div>
  );
}
