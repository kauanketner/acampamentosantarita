import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { brl, invoices } from '@/mock/data';

export const Route = createFileRoute('/_auth/financeiro/$invoiceId')({
  component: FaturaDetalhe,
});

function FaturaDetalhe() {
  const { invoiceId } = Route.useParams();
  const inv = invoices.find((i) => i.id === invoiceId);

  if (!inv) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/financeiro" title="Fatura" />
        <div className="px-6 py-12 text-center">
          <p className="font-display text-2xl">Fatura não encontrada.</p>
        </div>
      </Page>
    );
  }

  const remaining = inv.amount - inv.paid;
  const pct = (inv.paid / inv.amount) * 100;

  return (
    <Page>
      <TopBar back="/financeiro" title="Fatura" border />

      <div className="px-5 pt-4 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          {inv.reference}
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {inv.description}
        </h1>
      </div>

      <div className="px-5 mt-2">
        <div className="surface-warmth rounded-(--radius-lg) border border-(color:--color-border-strong) p-5">
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-sm text-(color:--color-muted-foreground)">Total</p>
            <Badge tone={inv.status === 'pago' ? 'success' : 'warning'}>{inv.status}</Badge>
          </div>
          <p
            className="font-display text-3xl tracking-tight"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
          >
            {brl(inv.amount)}
          </p>
          <Separator className="my-4" />
          <Progress value={pct} className="mb-3" />
          <div className="flex items-baseline justify-between">
            <p className="text-sm">
              Pago <span className="font-mono">{brl(inv.paid)}</span>
            </p>
            <p className="text-sm font-medium">
              Restante <span className="font-mono">{brl(remaining)}</span>
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-(color:--color-muted-foreground) mt-3">
            Vence em{' '}
            {new Date(inv.dueDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <SectionTitle>Pagamentos</SectionTitle>
      <div className="px-5 grid gap-2">
        {inv.paid > 0 ? (
          <Card variant="outline">
            <CardBody className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center shrink-0 dark:bg-emerald-900/40 dark:text-emerald-200">
                <CheckCircle2 className="size-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium">PIX</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-muted-foreground)">
                  12 abr · 14:38
                </p>
              </div>
              <p className="font-mono text-sm">{brl(inv.paid)}</p>
            </CardBody>
          </Card>
        ) : (
          <p className="text-sm text-(color:--color-muted-foreground)">Nenhum pagamento ainda.</p>
        )}
      </div>

      {remaining > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-20 px-5 pt-3 pb-2 bg-gradient-to-t from-(color:--color-background) via-(color:--color-background)/90 to-transparent">
          <Button block size="lg">
            Pagar {brl(remaining)}
          </Button>
        </div>
      )}
    </Page>
  );
}
