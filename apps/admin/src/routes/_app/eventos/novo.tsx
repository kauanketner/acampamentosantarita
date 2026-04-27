import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/novo')({
  component: NovoEvento,
});

function NovoEvento() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Novo evento</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: wizard em passos:
            1) Tipo (acampamento numerado vs outros) + nome + datas + local.
            2) Inscrições (campista/equipista, valores, prazo, primeira vez permitida).
            3) Capa, descrição, perguntas customizadas iniciais.
            4) Confirmação. */}
      </p>
    </div>
  );
}
