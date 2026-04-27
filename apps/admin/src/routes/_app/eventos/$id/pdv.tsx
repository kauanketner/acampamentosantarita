import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/$id/pdv')({
  component: EventoPdv,
});

function EventoPdv() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">PDV — {/* nome do evento */}</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: tela rápida (mobile-first dentro do admin) para registrar consumo
            na conta de um participante: busca pessoa → seleciona itens (cantina/lojinha)
            → confirma. Lista de contas abertas, total acumulado. */}
      </p>
    </div>
  );
}
