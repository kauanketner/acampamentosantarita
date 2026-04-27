import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { ArchGlyph } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { brl, invoices, posTransactions } from '@/mock/data';

export const Route = createFileRoute('/_auth/financeiro/')({
  component: FinanceiroIndex,
});

const statusInfo: Record<
  string,
  { label: string; tone: 'primary' | 'neutral' | 'warning' | 'success' | 'danger' }
> = {
  pago: { label: 'pago', tone: 'success' },
  pendente: { label: 'pendente', tone: 'warning' },
  parcial: { label: 'parcial', tone: 'warning' },
  vencido: { label: 'vencido', tone: 'danger' },
  cancelado: { label: 'cancelado', tone: 'neutral' },
  reembolsado: { label: 'reembolsado', tone: 'neutral' },
};

function FinanceiroIndex() {
  const open = invoices.filter((i) => i.status === 'pendente' || i.status === 'parcial');
  const paid = invoices.filter((i) => i.status === 'pago');
  const totalOpen = open.reduce((acc, i) => acc + (i.amount - i.paid), 0);
  const posTotal = posTransactions.reduce((acc, t) => acc + t.total, 0);

  return (
    <Page>
      <div className="safe-top" />
      <PageHeader
        eyebrow="Suas finanças"
        title={
          <>
            Em <span className="font-display-italic">aberto.</span>
          </>
        }
        className="pt-12 pb-2"
      />

      {/* Saldo aberto — bloco litúrgico de destaque */}
      <div className="px-5 pb-2">
        <div className="surface-warmth rounded-(--radius-lg) border border-(color:--color-border-strong) p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
            Total devido
          </p>
          <p
            className="font-display text-[clamp(2.5rem,12vw,3.5rem)] leading-[0.95] tracking-[-0.025em]"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
          >
            {brl(totalOpen)}
          </p>
          <p className="text-sm text-(color:--color-muted-foreground) mt-2">
            Em {open.length} fatura{open.length !== 1 && 's'}.
          </p>
        </div>
      </div>

      {/* Conta PDV em destaque — se houver */}
      {posTotal > 0 && (
        <div className="px-5 pt-3">
          <Link
            to="/financeiro/pdv-evento"
            className="block rounded-(--radius-lg) border border-(color:--color-accent)/40 bg-(color:--color-accent-soft) p-5"
          >
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-(color:--color-accent) text-(color:--color-accent-foreground) inline-flex items-center justify-center shrink-0">
                <ShoppingBag className="size-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-accent-foreground)/80 mb-0.5">
                  Conta no evento atual
                </p>
                <p className="font-medium text-[15px]">
                  Cantina · {posTransactions.length} lançamentos
                </p>
                <p
                  className="font-display text-2xl mt-1 tracking-tight"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
                >
                  {brl(posTotal)}
                </p>
              </div>
              <ArrowUpRight className="size-5 text-(color:--color-accent-foreground)/60" />
            </div>
          </Link>
        </div>
      )}

      {open.length > 0 && (
        <>
          <SectionTitle>Faturas em aberto</SectionTitle>
          <div className="px-5 grid gap-3">
            {open.map((inv) => {
              const pct = (inv.paid / inv.amount) * 100;
              return (
                <Link
                  key={inv.id}
                  to="/financeiro/$invoiceId"
                  params={{ invoiceId: inv.id }}
                  className="block surface-warmth rounded-(--radius-lg) border border-(color:--color-border) p-5 transition active:scale-[0.99]"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                      {inv.reference}
                    </p>
                    <Badge tone={statusInfo[inv.status]?.tone}>
                      {statusInfo[inv.status]?.label}
                    </Badge>
                  </div>
                  <p className="font-medium text-[15px] leading-snug">{inv.description}</p>
                  <div className="mt-3">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <p className="font-mono text-xs text-(color:--color-muted-foreground)">
                        {brl(inv.paid)} de {brl(inv.amount)}
                      </p>
                      <p className="font-mono text-xs">
                        Vence {new Date(inv.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                    <Progress value={pct} />
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {open.length > 0 && (
        <div className="px-5 mt-5">
          <Button block size="lg">
            Pagar tudo · {brl(totalOpen)}
          </Button>
        </div>
      )}

      {paid.length > 0 && (
        <>
          <SectionTitle>Histórico</SectionTitle>
          <div className="px-5 grid gap-2 pb-6">
            {paid.map((inv) => (
              <Card key={inv.id} variant="outline">
                <CardBody className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                      {inv.reference}
                    </p>
                    <p className="text-[14px] mt-0.5">{inv.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">{brl(inv.amount)}</p>
                    <Badge tone="success" className="mt-1">
                      pago
                    </Badge>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="px-5 pb-4 flex flex-col items-center text-(color:--color-muted-foreground)">
        <ArchGlyph className="size-6 opacity-30" />
      </div>
    </Page>
  );
}
