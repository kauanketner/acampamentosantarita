import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/minhas-inscricoes/$id')({
  component: InscricaoDetalhe,
});

function InscricaoDetalhe() {
  return (
    <div>
      <TopBar title="Inscrição" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: detalhe da inscrição — evento, papel, status, pagamento,
              respostas das perguntas customizadas, snapshot de saúde,
              opção de cancelamento (se permitido). */}
        </p>
      </div>
    </div>
  );
}
