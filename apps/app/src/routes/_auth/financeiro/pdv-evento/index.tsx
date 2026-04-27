import { createFileRoute } from '@tanstack/react-router';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { brl, posTransactions } from '@/mock/data';

export const Route = createFileRoute('/_auth/financeiro/pdv-evento/')({
  component: PdvEventoConta,
});

function PdvEventoConta() {
  const total = posTransactions.reduce((acc, t) => acc + t.total, 0);
  const grouped = groupByDay(posTransactions);

  return (
    <Page>
      <TopBar back="/financeiro" title="Conta no evento" border />

      <div className="px-5 pt-4 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          14º Acampamento · cantina e lojinha
        </p>
        <h1
          className="font-display text-[clamp(2.4rem,12vw,3.4rem)] leading-[0.95] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
        >
          {brl(total)}
        </h1>
        <Badge tone="warning" className="mt-3">
          conta aberta
        </Badge>
      </div>

      <div className="px-5 pt-5 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-3">
          Lançamentos
        </p>
      </div>

      <div className="px-5 pb-32 grid gap-5">
        {Object.entries(grouped).map(([day, items]) => (
          <div key={day}>
            <p className="text-xs text-(color:--color-muted-foreground) mb-2">{day}</p>
            <ul className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) divide-y divide-(color:--color-border)">
              {items.map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px]">{t.itemName}</p>
                    <p className="font-mono text-[11px] text-(color:--color-muted-foreground) mt-0.5">
                      {t.quantity > 1 ? `${t.quantity}× · ` : ''}
                      {t.recordedAt}
                    </p>
                  </div>
                  <p className="font-mono text-sm">{brl(t.total)}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-20 px-5 pt-3 pb-2 bg-gradient-to-t from-(color:--color-background) via-(color:--color-background)/90 to-transparent grid gap-2">
        <Button block size="lg">
          Pagar saldo · {brl(total)}
        </Button>
        <Button variant="ghost" size="md">
          Pagar parcial
        </Button>
      </div>
    </Page>
  );
}

function groupByDay(items: typeof posTransactions) {
  const map: Record<string, typeof posTransactions> = {};
  for (const t of items) {
    const day = t.recordedAt.split(',')[0]?.trim() ?? 'hoje';
    if (!map[day]) map[day] = [];
    map[day]!.push(t);
  }
  return map;
}
