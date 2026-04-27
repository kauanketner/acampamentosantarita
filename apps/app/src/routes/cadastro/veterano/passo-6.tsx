import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cadastro/veterano/passo-6')({
  component: PassoSeis,
});

function PassoSeis() {
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <p className="text-xs text-muted-foreground">Passo 6 de 6 — exclusivo veteranos</p>
      <h1 className="text-xl font-bold mt-1">Histórico de acampamentos</h1>
      <p className="text-sm text-muted-foreground mt-2">
        {/* TODO: lista dinâmica de participações. Cada item:
            edição (1..13), papel (campista/equipista/líder), tribo (texto livre se
            ainda não cadastrada → tribe_name_legacy), equipe de serviço (se equipista),
            função (texto livre). Pode adicionar/remover entradas. POST /v1/camp-history/me. */}
      </p>
    </div>
  );
}
