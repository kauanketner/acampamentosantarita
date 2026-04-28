import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { brl } from '@/lib/format';
import { useFinanceReport } from '@/lib/queries/reports';

export const Route = createFileRoute('/_app/relatorios/financeiro')({
  component: RelatoriosFinanceiro,
});

const statusLabel: Record<string, string> = {
  pendente: 'A receber',
  parcial: 'Parcial',
  pago: 'Recebido',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
  reembolsado: 'Reembolsado',
};

const methodLabel: Record<string, string> = {
  pix: 'PIX',
  cartao: 'Cartão',
  boleto: 'Boleto',
  dinheiro: 'Dinheiro',
  transferencia: 'Transferência',
};

const monthName = (m: string) => {
  // m is YYYY-MM
  const [, mm] = m.split('-');
  const names = ['', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return names[Number(mm)] ?? mm;
};

function RelatoriosFinanceiro() {
  const { data, isLoading } = useFinanceReport();

  const monthly = useMemo(() => {
    if (!data) return [] as { month: string; total: number }[];
    const map = new Map<string, number>();
    for (const p of data.payments) {
      map.set(p.month, (map.get(p.month) ?? 0) + Number(p.total));
    }
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 12)
      .reverse()
      .map(([month, total]) => ({ month, total }));
  }, [data]);

  const totalReceived = monthly.reduce((acc, m) => acc + m.total, 0);
  const maxMonth = Math.max(...monthly.map((m) => m.total), 1);

  const open = data?.invoiceTotals.find((t) => t.status === 'pendente');
  const partial = data?.invoiceTotals.find((t) => t.status === 'parcial');
  const overdue = data?.invoiceTotals.find((t) => t.status === 'vencido');

  return (
    <div className="px-8 py-8 max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Análise · Financeiro"
        title="Relatório financeiro"
        description="Receita mensal, saldos por status e movimentação recente. Tudo num só lugar para a tesouraria conferir com calma."
      />

      {isLoading && (
        <p className="text-sm text-(color:--color-muted-foreground)">
          Carregando…
        </p>
      )}

      {data && (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Stat
              label="Recebido (12m)"
              value={brl(totalReceived)}
              tone="success"
            />
            <Stat
              label="A receber"
              value={brl(Number(open?.total ?? 0) + Number(partial?.total ?? 0))}
              hint={`${(open?.count ?? 0) + (partial?.count ?? 0)} faturas`}
              tone="warning"
            />
            <Stat
              label="Vencido"
              value={brl(Number(overdue?.total ?? 0))}
              hint={`${overdue?.count ?? 0} faturas`}
              tone={Number(overdue?.total ?? 0) > 0 ? 'danger' : 'neutral'}
            />
          </section>

          <Card>
            <CardBody className="space-y-4">
              <header className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                    Série temporal
                  </p>
                  <h2
                    className="font-display text-xl tracking-tight mt-1"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
                  >
                    Receita por mês
                  </h2>
                </div>
                <p className="text-[11px] text-(color:--color-muted-foreground)">
                  Últimos 12 meses ·{' '}
                  <span className="font-mono tabular-nums text-(color:--color-foreground)">
                    {brl(totalReceived)}
                  </span>
                </p>
              </header>
              {monthly.length === 0 ? (
                <p className="text-sm text-(color:--color-muted-foreground)">
                  Sem pagamentos registrados nos últimos 12 meses.
                </p>
              ) : (
                <div>
                  <div className="grid grid-cols-12 gap-1.5 items-end h-44">
                    {monthly.map((m) => {
                      const ratio = (m.total / maxMonth) * 100;
                      return (
                        <div
                          key={m.month}
                          className="group flex flex-col justify-end items-center gap-1.5"
                          title={`${monthName(m.month)} · ${brl(m.total)}`}
                        >
                          <span className="text-[9px] font-mono tabular-nums opacity-0 group-hover:opacity-100 transition-opacity text-(color:--color-foreground)">
                            {brl(m.total)}
                          </span>
                          <div
                            className="w-full rounded-t-(--radius-sm) bg-(color:--color-primary)/80 group-hover:bg-(color:--color-primary) transition-colors"
                            style={{ height: `${Math.max(ratio, 2)}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-12 gap-1.5 mt-2">
                    {monthly.map((m) => (
                      <p
                        key={m.month}
                        className="text-[10px] font-mono uppercase tracking-[0.1em] text-(color:--color-muted-foreground) text-center"
                      >
                        {monthName(m.month)}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardBody className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                  Saldo por status
                </p>
                {data.invoiceTotals.length === 0 ? (
                  <p className="text-xs text-(color:--color-muted-foreground)">
                    Sem faturas.
                  </p>
                ) : (
                  <ul className="divide-y divide-(color:--color-border)">
                    {data.invoiceTotals.map((t) => (
                      <li
                        key={t.status}
                        className="flex items-baseline justify-between text-sm py-2 first:pt-0 last:pb-0"
                      >
                        <span>{statusLabel[t.status] ?? t.status}</span>
                        <span className="text-right">
                          <span className="font-mono tabular-nums">
                            {brl(Number(t.total ?? 0))}
                          </span>
                          <span className="text-[11px] text-(color:--color-muted-foreground) ml-2">
                            {t.count} {t.count === 1 ? 'fatura' : 'faturas'}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                  Por método de pagamento (12m)
                </p>
                {data.payments.length === 0 ? (
                  <p className="text-xs text-(color:--color-muted-foreground)">
                    Sem pagamentos.
                  </p>
                ) : (
                  <ul className="divide-y divide-(color:--color-border)">
                    {Object.entries(
                      data.payments.reduce<Record<string, number>>(
                        (acc, p) => ({
                          ...acc,
                          [p.method]: (acc[p.method] ?? 0) + Number(p.total),
                        }),
                        {},
                      ),
                    )
                      .sort((a, b) => b[1] - a[1])
                      .map(([method, total]) => (
                        <li
                          key={method}
                          className="flex items-center justify-between text-sm py-2 first:pt-0 last:pb-0"
                        >
                          <span>{methodLabel[method] ?? method}</span>
                          <span className="font-mono tabular-nums">
                            {brl(total)}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          </section>

          <Card>
            <CardBody className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                Pagamentos recentes · 30 dias
              </p>
              {data.recentPayments.length === 0 ? (
                <p className="text-sm text-(color:--color-muted-foreground)">
                  Sem movimentação no período.
                </p>
              ) : (
                <ul className="divide-y divide-(color:--color-border)">
                  {data.recentPayments.map((p) => (
                    <li
                      key={p.id}
                      className="py-2.5 flex items-center justify-between gap-3 text-sm first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="font-medium leading-tight">
                          {p.personName}
                        </p>
                        <p className="text-[11px] text-(color:--color-muted-foreground) mt-0.5">
                          <span className="font-mono uppercase tracking-wider text-[10px]">
                            {methodLabel[p.method] ?? p.method}
                          </span>{' '}
                          ·{' '}
                          {new Date(p.paidAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className="font-mono tabular-nums">
                        {brl(Number(p.amount))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
