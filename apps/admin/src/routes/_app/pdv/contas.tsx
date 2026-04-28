import { ApiError } from '@/lib/api';
import { brl, formatDate } from '@/lib/format';
import { useAdminEvents } from '@/lib/queries/events';
import { useAdminPersons } from '@/lib/queries/persons';
import {
  type PosAccountRow,
  type PosAccountStatus,
  useAddPosTransaction,
  useClosePosAccount,
  useDeletePosTransaction,
  useOpenPosAccount,
  usePosAccount,
  usePosAccounts,
  usePosItems,
} from '@/lib/queries/pos';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/_app/pdv/contas')({
  component: PdvContas,
});

const statusLabel: Record<
  PosAccountStatus,
  { label: string; tone: 'green' | 'amber' | 'neutral' }
> = {
  aberta: { label: 'Aberta', tone: 'amber' },
  fechada: { label: 'Fechada', tone: 'neutral' },
  paga: { label: 'Paga', tone: 'green' },
};

const toneClass: Record<'green' | 'amber' | 'neutral', string> = {
  neutral: 'bg-secondary text-secondary-foreground border-border',
  amber:
    'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  green:
    'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
};

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function PdvContas() {
  const { data: events } = useAdminEvents();
  const ongoing = useMemo(
    () =>
      (events ?? []).find((e) => e.status === 'em_andamento' || e.status === 'inscricoes_fechadas'),
    [events],
  );
  const [eventId, setEventId] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<PosAccountStatus | 'all'>('aberta');
  const [opening, setOpening] = useState(false);

  const effectiveEventId = eventId || ongoing?.id;
  const { data, isLoading } = usePosAccounts({
    eventId: effectiveEventId,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const totalOpen = (data ?? [])
    .filter((a) => a.status === 'aberta')
    .reduce((acc, a) => acc + Number(a.totalAmount), 0);

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">PDV — Contas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Contas abertas durante o evento. Cada lançamento (cantina/lojinha) entra em uma conta.
          Quando você fecha a conta, é gerada uma fatura correspondente.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Evento</span>
          <select
            value={effectiveEventId ?? ''}
            onChange={(e) => setEventId(e.target.value || undefined)}
            className={`mt-1 ${inputClass}`}
          >
            <option value="">— escolha —</option>
            {events?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PosAccountStatus | 'all')}
            className={`mt-1 ${inputClass}`}
          >
            <option value="aberta">Apenas abertas</option>
            <option value="fechada">Fechadas</option>
            <option value="paga">Pagas</option>
            <option value="all">Todas</option>
          </select>
        </label>
      </div>

      {effectiveEventId && (
        <div className="rounded-lg border bg-card p-5 flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Total em aberto
            </p>
            <p className="font-serif text-2xl mt-1 tabular-nums">{brl(totalOpen)}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpening(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Abrir nova conta
          </button>
        </div>
      )}

      {opening && effectiveEventId && (
        <OpenAccountForm
          eventId={effectiveEventId}
          onCancel={() => setOpening(false)}
          onCreated={() => setOpening(false)}
        />
      )}

      {!effectiveEventId && (
        <p className="text-sm text-muted-foreground">Escolha um evento pra ver as contas.</p>
      )}

      {effectiveEventId && isLoading && (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      )}

      {effectiveEventId && data && data.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          Sem contas neste filtro.
        </div>
      )}

      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((acc) => (
            <AccountRow key={acc.id} account={acc} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AccountRow({ account }: { account: PosAccountRow }) {
  const close = useClosePosAccount();
  const status = statusLabel[account.status];
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClose = async () => {
    if (!confirm('Fechar conta? Será gerada uma fatura com o saldo.')) return;
    setError(null);
    try {
      await close.mutateAsync(account.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível fechar.');
    }
  };

  return (
    <li className="rounded-lg border bg-card overflow-hidden">
      <div className="p-4 flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-tight">{account.person.fullName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {account.event.name} · aberta em {formatDate(account.openedAt)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass[status.tone]}`}
            >
              {status.label}
            </span>
            <span className="font-mono text-sm">{brl(Number(account.totalAmount))}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs text-primary underline"
          >
            {open ? 'Fechar' : 'Lançamentos'}
          </button>
          {account.status === 'aberta' && (
            <button
              type="button"
              onClick={onClose}
              disabled={close.isPending}
              className="rounded-md border px-3 py-1 text-xs hover:bg-secondary disabled:opacity-50"
            >
              {close.isPending ? '…' : 'Fechar conta'}
            </button>
          )}
        </div>
      </div>
      {open && <AccountTransactions accountId={account.id} />}
    </li>
  );
}

function AccountTransactions({ accountId }: { accountId: string }) {
  const { data, isLoading } = usePosAccount(accountId);
  const { data: items } = usePosItems();
  const add = useAddPosTransaction();
  const remove = useDeletePosTransaction();
  const [picked, setPicked] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  if (isLoading || !data) {
    return (
      <div className="border-t bg-secondary/20 p-4 text-xs text-muted-foreground">
        Carregando lançamentos…
      </div>
    );
  }

  const activeItems = (items ?? []).filter((i) => i.active);
  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!picked) return;
    const item = activeItems.find((i) => i.id === picked);
    if (!item) return;
    setError(null);
    try {
      await add.mutateAsync({
        accountId,
        input: {
          posItemId: item.id,
          itemName: item.name,
          quantity: qty,
          unitPrice: item.price,
        },
      });
      setPicked('');
      setQty(1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível lançar.');
    }
  };

  return (
    <div className="border-t bg-secondary/20 p-4 space-y-3">
      {data.status === 'aberta' && activeItems.length > 0 && (
        <form onSubmit={onAdd} className="flex flex-wrap items-end gap-2">
          <label className="block flex-1 min-w-[200px]">
            <span className="text-[11px] text-muted-foreground">Item</span>
            <select
              value={picked}
              onChange={(e) => setPicked(e.target.value)}
              className={inputClass}
            >
              <option value="">— escolha —</option>
              {activeItems.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} · {brl(Number(i.price))}
                </option>
              ))}
            </select>
          </label>
          <label className="block w-20">
            <span className="text-[11px] text-muted-foreground">Qtd</span>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            disabled={!picked || add.isPending}
            className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            Lançar
          </button>
          {error && <p className="w-full text-xs text-destructive">{error}</p>}
        </form>
      )}
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
          Lançamentos ({data.transactions.length})
        </p>
        {data.transactions.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum.</p>
        ) : (
          <ul className="space-y-1.5">
            {data.transactions.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-md border bg-background px-3 py-1.5 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium">{t.itemName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t.quantity > 1 && `${t.quantity}× · `}
                    {brl(Number(t.unitPrice))} ·{' '}
                    {new Date(t.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{brl(Number(t.total))}</span>
                  {data.status === 'aberta' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Remover este lançamento?')) {
                          remove.mutate(t.id);
                        }
                      }}
                      className="text-[10px] text-destructive underline"
                    >
                      ×
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function OpenAccountForm({
  eventId,
  onCancel,
  onCreated,
}: {
  eventId: string;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [search, setSearch] = useState('');
  const { data: persons } = useAdminPersons(search.length >= 2 ? search : undefined);
  const open = useOpenPosAccount();
  const [error, setError] = useState<string | null>(null);

  const onSelect = async (personId: string) => {
    setError(null);
    try {
      await open.mutateAsync({ eventId, personId });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível abrir conta.');
    }
  };

  return (
    <div className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="font-serif text-lg">Abrir conta</h2>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar pessoa por nome…"
        className={inputClass}
        autoFocus
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {search.length >= 2 && persons && (
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {persons.length === 0 ? (
            <li className="text-xs text-muted-foreground">Nenhuma pessoa encontrada.</li>
          ) : (
            persons.slice(0, 10).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{p.fullName}</p>
                  {p.city && (
                    <p className="text-[11px] text-muted-foreground">
                      {p.city}
                      {p.state && `/${p.state}`}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(p.id)}
                  disabled={open.isPending}
                  className="rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-xs disabled:opacity-50"
                >
                  Abrir
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      <button type="button" onClick={onCancel} className="text-xs text-muted-foreground underline">
        Cancelar
      </button>
    </div>
  );
}
