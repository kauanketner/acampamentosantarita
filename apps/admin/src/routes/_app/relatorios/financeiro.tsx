import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
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

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Relatório — Financeiro</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Receita mensal, saldo de faturas e movimentação recente.
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && (
        <>
          <section className="rounded-lg border bg-card p-5 space-y-3">
            <header className="flex items-baseline justify-between">
              <h2 className="font-serif text-lg">Receita por mês (últimos 12)</h2>
              <p className="text-xs text-muted-foreground">
                Total: <span className="font-mono">{brl(totalReceived)}</span>
              </p>
            </header>
            {monthly.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sem pagamentos registrados.
              </p>
            ) : (
              <div className="grid grid-cols-12 gap-1.5 items-end h-40">
                {monthly.map((m) => (
                  <div
                    key={m.month}
                    className="flex flex-col justify-end items-center"
                  >
                    <div
                      className="w-full bg-primary/70 rounded-t"
                      style={{ height: `${(m.total / maxMonth) * 100}%` }}
                      title={brl(m.total)}
                    />
                    <p className="text-[9px] text-muted-foreground mt-1 font-mono">
                      {m.month.slice(5)}/{m.month.slice(2, 4)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-5 space-y-2">
              <h2 className="font-serif text-lg">Saldo por status</h2>
              {data.invoiceTotals.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem faturas.</p>
              ) : (
                <ul className="space-y-1">
                  {data.invoiceTotals.map((t) => (
                    <li
                      key={t.status}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{statusLabel[t.status] ?? t.status}</span>
                      <span className="font-mono">
                        {brl(Number(t.total ?? 0))}
                        <span className="text-xs text-muted-foreground ml-2">
                          ({t.count})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-lg border bg-card p-5 space-y-2">
              <h2 className="font-serif text-lg">Por método (12 meses)</h2>
              {data.payments.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Sem pagamentos.
                </p>
              ) : (
                <ul className="space-y-1">
                  {Object.entries(
                    data.payments.reduce<Record<string, number>>(
                      (acc, p) => ({
                        ...acc,
                        [p.method]: (acc[p.method] ?? 0) + Number(p.total),
                      }),
                      {},
                    ),
                  ).map(([method, total]) => (
                    <li
                      key={method}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{methodLabel[method] ?? method}</span>
                      <span className="font-mono">{brl(total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5 space-y-3">
            <h2 className="font-serif text-lg">Pagamentos recentes (30 dias)</h2>
            {data.recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem movimentação.</p>
            ) : (
              <ul className="divide-y">
                {data.recentPayments.map((p) => (
                  <li
                    key={p.id}
                    className="py-2 flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{p.personName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {methodLabel[p.method] ?? p.method} ·{' '}
                        {new Date(p.paidAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="font-mono">{brl(Number(p.amount))}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
