import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/configuracoes/auditoria')({
  component: ConfiguracoesAuditoria,
});

function ConfiguracoesAuditoria() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Auditoria</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: visualização do audit_log com filtros (usuário, ação, entidade,
            período). Diff before/after expansível por linha. */}
      </p>
    </div>
  );
}
