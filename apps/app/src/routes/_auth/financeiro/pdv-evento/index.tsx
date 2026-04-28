import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { brl } from '@/lib/format';
import { type PosTransaction, useMyPosAccount } from '@/lib/queries/pos';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Loader2, ShoppingBag } from 'lucide-react';

export const Route = createFileRoute('/_auth/financeiro/pdv-evento/')({
  component: PdvEventoConta,
});

const statusLabel: Record<string, { label: string; tone: 'warning' | 'success' | 'neutral' }> = {
  aberta: { label: 'conta aberta', tone: 'warning' },
  fechada: { label: 'conta fechada', tone: 'neutral' },
  paga: { label: 'conta paga', tone: 'success' },
};

function PdvEventoConta() {
  const { data: account, isLoading, isError } = useMyPosAccount();

  if (isLoading) {
    return (
      <Page>
        <TopBar back="/financeiro" title="Conta no evento" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <TopBar back="/financeiro" title="Conta no evento" border />
        <div className="px-6 py-12 text-center">
          <p className="font-display text-2xl">Não conseguimos buscar.</p>
        </div>
      </Page>
    );
  }

  if (!account) {
    return (
      <Page>
        <TopBar back="/financeiro" title="Conta no evento" border />
        <EmptyState
          className="py-20"
          icon={<ShoppingBag className="size-10" strokeWidth={1.2} />}
          title="Nenhuma conta de evento"
          description="Quando você consumir algo na cantina ou lojinha, os lançamentos aparecem aqui."
        />
      </Page>
    );
  }

  const total = Number(account.totalAmount);
  const grouped = groupByDay(account.transactions);
  const status = statusLabel[account.status];

  return (
    <Page>
      <TopBar back="/financeiro" title="Conta no evento" border />

      <div className="px-5 pt-4 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          {account.event.name} · cantina e lojinha
        </p>
        <h1
          className="font-display text-[clamp(2.4rem,12vw,3.4rem)] leading-[0.95] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
        >
          {brl(total)}
        </h1>
        {status && (
          <Badge tone={status.tone} className="mt-3">
            {status.label}
          </Badge>
        )}
      </div>

      <div className="px-5 pt-5 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-3">
          Lançamentos
        </p>
      </div>

      <div className="px-5 pb-12 grid gap-5">
        {account.transactions.length === 0 && (
          <p className="text-sm text-(color:--color-muted-foreground)">
            Sem lançamentos por enquanto.
          </p>
        )}
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
                      {new Date(t.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <p className="font-mono text-sm">{brl(Number(t.total))}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {account.status === 'aberta' && total > 0 && (
        <div className="px-5 pb-12">
          <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) p-4">
            <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed mb-3">
              O pagamento online da cantina vai ficar disponível em breve. Por enquanto, o time da
              cantina recebe na hora.
            </p>
            <Button asChild block size="md" variant="ghost">
              <Link to="/financeiro">Voltar</Link>
            </Button>
          </div>
        </div>
      )}
    </Page>
  );
}

function groupByDay(items: PosTransaction[]): Record<string, PosTransaction[]> {
  const map: Record<string, PosTransaction[]> = {};
  for (const t of items) {
    const day = new Date(t.createdAt).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
    });
    if (!map[day]) map[day] = [];
    map[day]!.push(t);
  }
  return map;
}
