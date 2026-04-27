import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/pessoas/$id')({
  component: PessoaDetalhe,
});

function PessoaDetalhe() {
  const { id } = Route.useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Perfil — {id}</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: GET /v1/persons/:id/full-profile.
            Tabs: Dados, Endereço, Contatos de Emergência, Saúde, Vida de Fé,
            Histórico de Acampamentos, Inscrições, Financeiro, Auditoria. */}
      </p>
    </div>
  );
}
