import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/eventos/$slug/inscricao/pagamento')({
  component: InscricaoPagamento,
});

function InscricaoPagamento() {
  return (
    <div>
      <TopBar title="Pagamento" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: opções PIX / cartão / boleto via Asaas. Mostrar QR Code do PIX,
              link do boleto, ou redirect para checkout do cartão. */}
        </p>
      </div>
    </div>
  );
}
