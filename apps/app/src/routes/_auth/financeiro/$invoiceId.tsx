import { Page } from '@/components/shell/Page';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { TopBar } from '@/components/shell/TopBar';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { brl } from '@/lib/format';
import { type InvoiceStatus, type PaymentMethod, useMyInvoice } from '@/lib/queries/finance';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/_auth/financeiro/$invoiceId')({
  component: FaturaDetalhe,
});

const statusInfo: Record<
  InvoiceStatus,
  { label: string; tone: 'primary' | 'neutral' | 'warning' | 'success' | 'danger' }
> = {
  pago: { label: 'pago', tone: 'success' },
  pendente: { label: 'pendente', tone: 'warning' },
  parcial: { label: 'parcial', tone: 'warning' },
  vencido: { label: 'vencido', tone: 'danger' },
  cancelado: { label: 'cancelado', tone: 'neutral' },
  reembolsado: { label: 'reembolsado', tone: 'neutral' },
};

const methodLabel: Record<PaymentMethod, string> = {
  pix: 'PIX',
  cartao: 'Cartão',
  boleto: 'Boleto',
  dinheiro: 'Dinheiro',
  transferencia: 'Transferência',
};

function FaturaDetalhe() {
  const { invoiceId } = Route.useParams();
  const { data: inv, isLoading, isError } = useMyInvoice(invoiceId);

  if (isLoading) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/financeiro" title="Fatura" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  if (isError || !inv) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/financeiro" title="Fatura" border />
        <div className="px-6 py-16 text-center">
          <p className="font-display text-2xl">Fatura não encontrada.</p>
        </div>
      </Page>
    );
  }

  const total = Number(inv.amount);
  const paid = Number(inv.paidAmount);
  const remaining = Math.max(0, total - paid);
  const pct = total > 0 ? (paid / total) * 100 : 0;
  const status = statusInfo[inv.status];

  return (
    <Page withBottomNav={false}>
      <TopBar back="/financeiro" title="Fatura" border />

      <div className="px-5 pt-4 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          {invoiceTypeLabel(inv.type)}
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {inv.description ?? 'Fatura'}
        </h1>
      </div>

      <div className="px-5 mt-2">
        <div className="surface-warmth rounded-(--radius-lg) border border-(color:--color-border-strong) p-5">
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-sm text-(color:--color-muted-foreground)">Total</p>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
          <p
            className="font-display text-3xl tracking-tight"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
          >
            {brl(total)}
          </p>
          <Separator className="my-4" />
          <Progress value={pct} className="mb-3" />
          <div className="flex items-baseline justify-between">
            <p className="text-sm">
              Pago <span className="font-mono">{brl(paid)}</span>
            </p>
            <p className="text-sm font-medium">
              Restante <span className="font-mono">{brl(remaining)}</span>
            </p>
          </div>
          {inv.dueDate && (
            <p className="font-mono text-[11px] uppercase tracking-wider text-(color:--color-muted-foreground) mt-3">
              Vence em{' '}
              {new Date(inv.dueDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      <SectionTitle>Pagamentos</SectionTitle>
      <div className="px-5 grid gap-2">
        {inv.payments.length === 0 ? (
          <p className="text-sm text-(color:--color-muted-foreground)">
            Nenhum pagamento registrado ainda.
          </p>
        ) : (
          inv.payments.map((p) => (
            <Card key={p.id} variant="outline">
              <CardBody className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center shrink-0 dark:bg-emerald-900/40 dark:text-emerald-200">
                  <CheckCircle2 className="size-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium">{methodLabel[p.method]}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-muted-foreground)">
                    {new Date(p.paidAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="font-mono text-sm">{brl(Number(p.amount))}</p>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {remaining > 0 && (
        <div className="px-5 py-8">
          <Card variant="outline">
            <CardBody>
              <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
                Pagamento online vai ficar disponível quando a coordenação ligar a integração com
                Asaas. Por enquanto, eles enviam as instruções por fora do app.
              </p>
            </CardBody>
          </Card>
        </div>
      )}
    </Page>
  );
}

function invoiceTypeLabel(type: string): string {
  const map: Record<string, string> = {
    registration: 'Inscrição',
    pos: 'Conta no evento',
    shop: 'Lojinha',
    other: 'Outro',
  };
  return map[type] ?? 'Fatura';
}
