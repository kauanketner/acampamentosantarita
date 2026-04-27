import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/configuracoes/permissoes')({
  component: ConfiguracoesPermissoes,
});

function ConfiguracoesPermissoes() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Permissões</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: matriz role × permissão. Começar com roles fixos no enum,
            evoluir para permissões granulares se necessário. */}
      </p>
    </div>
  );
}
