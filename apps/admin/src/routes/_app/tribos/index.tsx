import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/tribos/')({
  component: TribosIndex,
});

function TribosIndex() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tribos (histórico)</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: visão histórica de todas as tribos por edição do acampamento.
            Permite consulta rápida: "quem foi líder na tribo X no 12º acampamento?". */}
      </p>
    </div>
  );
}
