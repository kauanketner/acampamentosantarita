import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/financeiro/$invoiceId')({
  component: FaturaDetalhe,
});

function FaturaDetalhe() {
  return (
    <div>
      <TopBar title="Fatura" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: itens da fatura, valor, vencimento, link Asaas (PIX/boleto),
              histórico de pagamentos parciais. */}
        </p>
      </div>
    </div>
  );
}
