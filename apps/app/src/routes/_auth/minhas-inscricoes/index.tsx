import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/minhas-inscricoes/')({
  component: MinhasInscricoes,
});

function MinhasInscricoes() {
  return (
    <div>
      <TopBar title="Minhas inscrições" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: GET /v1/registrations/me. Cards por evento com status,
              pagamento, data, ação (cancelar / pagar / ver detalhe). */}
        </p>
      </div>
    </div>
  );
}
