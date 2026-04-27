import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/financeiro/pdv-evento/')({
  component: PdvEventoConta,
});

function PdvEventoConta() {
  return (
    <div>
      <TopBar title="Minha conta no evento" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: GET /v1/pos/me/account?eventId=. Lista de transações (item,
              quantidade, total), saldo. CTA "Pagar parcial / total" → gera
              cobrança Asaas (não fecha a conta). */}
        </p>
      </div>
    </div>
  );
}
