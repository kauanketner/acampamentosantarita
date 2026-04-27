import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/financeiro/')({
  component: FinanceiroIndex,
});

function FinanceiroIndex() {
  return (
    <div>
      <TopBar title="Financeiro" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: GET /v1/finance/me/invoices. Lista de faturas com status,
              total devido em destaque, atalho para "Conta do PDV (evento atual)" se aberta. */}
        </p>
      </div>
    </div>
  );
}
