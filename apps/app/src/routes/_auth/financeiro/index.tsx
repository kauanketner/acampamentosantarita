import { ArchGlyph } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Progress } from '@/components/ui/progress';
import { brl } from '@/lib/format';
import { type Invoice, type InvoiceStatus, useMyInvoices } from '@/lib/queries/finance';
import { useMyPosAccount } from '@/lib/queries/pos';
import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, Loader2, ShoppingBag, Wallet } from 'lucide-react';

export const Route = createFileRoute('/_auth/financeiro/')({
  component: FinanceiroIndex,
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

function FinanceiroIndex() {
  const { data: invoices, isLoading: loadingInvoices } = useMyInvoices();
  const { data: posAccount, isLoading: loadingPos } = useMyPosAccount();

  const isLoading = loadingInvoices || loadingPos;

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

      {isLoading && (
        <div className="flex justify-center py-16 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {!isLoading && invoices && <Content invoices={invoices} posAccount={posAccount ?? null} />}

      <div className="px-5 pb-4 flex flex-col items-center text-(color:--color-muted-foreground)">
        <ArchGlyph className="size-6 opacity-30" />
      </div>
    </Page>
  );
}

function Content({
  invoices,
  posAccount,
}: {
  invoices: Invoice[];
  posAccount: ReturnType<typeof useMyPosAccount>['data'];
}) {
  const open = invoices.filter(
    (i) => i.status === 'pendente' || i.status === 'parcial' || i.status === 'vencido',
  );
  const paid = invoices.filter((i) => i.status === 'pago');
  const totalOpen = open.reduce((acc, i) => acc + (Number(i.amount) - Number(i.paidAmount)), 0);
  const posTotal = posAccount ? Number(posAccount.totalAmount) : 0;
  const posOpen = posAccount && posAccount.status === 'aberta' && posTotal > 0;

  if (invoices.length === 0 && (!posAccount || posAccount.status !== 'aberta' || posTotal === 0)) {
    return (
      <EmptyState
        className="py-16"
        icon={<Wallet className="size-10" strokeWidth={1.2} />}
        title="Nada em aberto"
        description="Quando uma fatura ou conta de cantina existir pra você, ela aparece aqui."
      />
    );
  }

  return (
    <>
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
            {open.length === 0
              ? 'Sem faturas abertas.'
              : `Em ${open.length} fatura${open.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
      </div>

      {posOpen && posAccount && (
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
                  {posAccount.event.name} · {posAccount.transactions.length} lançamento
                  {posAccount.transactions.length !== 1 ? 's' : ''}
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
            {open.map((inv) => (
              <InvoiceRow key={inv.id} inv={inv} />
            ))}
          </div>
        </>
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
                      {invoiceReference(inv)}
                    </p>
                    <p className="text-[14px] mt-0.5">{inv.description ?? '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">{brl(Number(inv.amount))}</p>
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
    </>
  );
}

function InvoiceRow({ inv }: { inv: Invoice }) {
  const total = Number(inv.amount);
  const paid = Number(inv.paidAmount);
  const pct = total > 0 ? (paid / total) * 100 : 0;
  const status = statusInfo[inv.status];
  return (
    <Link
      to="/financeiro/$invoiceId"
      params={{ invoiceId: inv.id }}
      className="block surface-warmth rounded-(--radius-lg) border border-(color:--color-border) p-5 transition active:scale-[0.99]"
    >
      <div className="flex items-baseline justify-between mb-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
          {invoiceReference(inv)}
        </p>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      <p className="font-medium text-[15px] leading-snug">{inv.description ?? 'Sem descrição'}</p>
      <div className="mt-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <p className="font-mono text-xs text-(color:--color-muted-foreground)">
            {brl(paid)} de {brl(total)}
          </p>
          {inv.dueDate && (
            <p className="font-mono text-xs">
              Vence{' '}
              {new Date(inv.dueDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
              })}
            </p>
          )}
        </div>
        <Progress value={pct} />
      </div>
    </Link>
  );
}

function invoiceReference(inv: Invoice): string {
  const map: Record<Invoice['type'], string> = {
    registration: 'Inscrição',
    pos: 'Conta no evento',
    shop: 'Lojinha',
    other: 'Outro',
  };
  return map[inv.type] ?? 'Fatura';
}
