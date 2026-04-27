import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/configuracoes/integracoes')({
  component: ConfiguracoesIntegracoes,
});

function ConfiguracoesIntegracoes() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Integrações</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: status das integrações (Asaas, Resend, R2, Web Push). Botões de teste,
            últimos eventos recebidos no webhook do Asaas. */}
      </p>
    </div>
  );
}
