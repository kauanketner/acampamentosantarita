import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { ApiError } from '@/lib/api';
import { brl, formatDate, maskPhoneDisplay } from '@/lib/format';
import {
  type AdminInvoice,
  type AdminInvoiceDetail,
  type InvoiceStatus,
  type PaymentMethod,
  type RecordCashPaymentInput,
  useAdminInvoice,
  useAdminInvoices,
  useDeletePayment,
  useRecordCashPayment,
} from '@/lib/queries/finance';

export const Route = createFileRoute('/_app/financeiro/faturas')({
  component: Faturas,
});

const statusInfo: Record<
  InvoiceStatus,
  { label: string; tone: 'green' | 'amber' | 'red' | 'neutral' }
> = {
  pago: { label: 'Pago', tone: 'green' },
  pendente: { label: 'Pendente', tone: 'amber' },
  parcial: { label: 'Parcial', tone: 'amber' },
  vencido: { label: 'Vencido', tone: 'red' },
  cancelado: { label: 'Cancelado', tone: 'neutral' },
  reembolsado: { label: 'Reembolsado', tone: 'neutral' },
};

const typeLabel: Record<AdminInvoice['type'], string> = {
  registration: 'Inscrição',
  pos: 'PDV',
  shop: 'Lojinha',
  other: 'Outro',
};

const toneClass: Record<'green' | 'amber' | 'red' | 'neutral', string> = {
  neutral: 'bg-secondary text-secondary-foreground border-border',
  green:
    'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
  amber:
    'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  red: 'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
};

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function Faturas() {
  const { data, isLoading, isError } = useAdminInvoices();
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>(
    'all',
  );
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (q && !inv.person.fullName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, statusFilter, search]);

  const totals = useMemo(() => {
    const acc = { open: 0, paid: 0, count: data?.length ?? 0 };
    for (const inv of data ?? []) {
      const total = Number(inv.amount);
      const paid = Number(inv.paidAmount);
      if (inv.status === 'cancelado' || inv.status === 'reembolsado') continue;
      acc.paid += paid;
      acc.open += Math.max(0, total - paid);
    }
    return acc;
  }, [data]);

  return (
    <div className="p-6 space-y-5 max-w-6xl">
      <header>
        <h1 className="font-serif text-2xl">Faturas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cobranças geradas pelas inscrições + PDV. Você pode registrar
          pagamento manualmente.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label="Total de faturas" value={totals.count} />
        <Stat label="Em aberto" value={brl(totals.open)} tone="amber" />
        <Stat label="Recebido" value={brl(totals.paid)} tone="green" />
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome…"
          className="flex-1 min-w-[200px] rounded-md border bg-background px-3 py-1.5 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | InvoiceStatus)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="all">Todos status</option>
          {(Object.keys(statusInfo) as InvoiceStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusInfo[s].label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar as faturas.
        </div>
      )}

      {data && filtered.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">
            {data.length === 0
              ? 'Sem faturas ainda'
              : 'Nenhuma fatura corresponde ao filtro'}
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-3 font-medium">Pessoa</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium text-right">Valor</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <InvoiceRow
                  key={inv.id}
                  invoice={inv}
                  open={openId === inv.id}
                  onToggle={() =>
                    setOpenId(openId === inv.id ? null : inv.id)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InvoiceRow({
  invoice,
  open,
  onToggle,
}: {
  invoice: AdminInvoice;
  open: boolean;
  onToggle: () => void;
}) {
  const total = Number(invoice.amount);
  const paid = Number(invoice.paidAmount);
  const remaining = Math.max(0, total - paid);
  const status = statusInfo[invoice.status];

  return (
    <>
      <tr className="border-b last:border-b-0 align-top">
        <td className="px-4 py-3">
          <p className="font-medium leading-tight">{invoice.person.fullName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {invoice.person.mobilePhone
              ? maskPhoneDisplay(invoice.person.mobilePhone)
              : '—'}
          </p>
          {invoice.description && (
            <p className="text-[11px] text-muted-foreground mt-1 max-w-md">
              {invoice.description}
            </p>
          )}
        </td>
        <td className="px-4 py-3 text-muted-foreground">
          {typeLabel[invoice.type]}
        </td>
        <td className="px-4 py-3 text-right whitespace-nowrap font-mono">
          <p>{brl(total)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {paid > 0 ? `Pago ${brl(paid)}` : 'Sem pagamento'}
          </p>
          {remaining > 0 && invoice.status !== 'cancelado' && (
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Falta {brl(remaining)}
            </p>
          )}
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass[status.tone]}`}
          >
            {status.label}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <button
            type="button"
            onClick={onToggle}
            className="text-xs text-primary underline"
          >
            {open ? 'Fechar' : 'Detalhes'}
          </button>
        </td>
      </tr>
      {open && (
        <tr className="border-b last:border-b-0 bg-secondary/20">
          <td colSpan={5} className="px-4 py-4">
            <InvoiceDetail invoiceId={invoice.id} />
          </td>
        </tr>
      )}
    </>
  );
}

function InvoiceDetail({ invoiceId }: { invoiceId: string }) {
  const { data, isLoading } = useAdminInvoice(invoiceId);
  const record = useRecordCashPayment();
  const remove = useDeletePayment();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RecordCashPaymentInput>({
    amount: '',
    method: 'pix',
    notes: '',
  });

  if (isLoading || !data) {
    return <p className="text-xs text-muted-foreground">Carregando…</p>;
  }

  const total = Number(data.amount);
  const paid = Number(data.paidAmount);
  const remaining = Math.max(0, total - paid);
  const canRegister =
    remaining > 0 && data.status !== 'cancelado' && data.status !== 'reembolsado';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.amount) return;
    try {
      await record.mutateAsync({
        invoiceId,
        input: {
          amount: Number(form.amount).toFixed(2),
          method: form.method,
          notes: form.notes || null,
        },
      });
      setForm({ amount: '', method: form.method ?? 'pix', notes: '' });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível registrar.',
      );
    }
  };

  const onDeletePayment = async (paymentId: string) => {
    if (!confirm('Excluir este pagamento? O saldo da fatura é recalculado.'))
      return;
    setError(null);
    try {
      await remove.mutateAsync(paymentId);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível excluir.',
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
          Pagamentos ({data.payments.length})
        </h3>
        {data.payments.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nenhum pagamento registrado ainda.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {data.payments.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {p.method.toUpperCase()} · {brl(Number(p.amount))}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatDate(p.paidAt)}
                    {p.notes && ` · ${p.notes}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeletePayment(p.id)}
                  className="text-[10px] text-destructive underline"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {canRegister && (
        <form onSubmit={onSubmit} className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
            Registrar pagamento
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Restante: <span className="font-mono">{brl(remaining)}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-[11px] text-muted-foreground">Valor</span>
              <input
                type="number"
                step="0.01"
                min={0}
                max={remaining}
                value={form.amount}
                onChange={(e) =>
                  setForm((s) => ({ ...s, amount: e.target.value }))
                }
                placeholder={remaining.toFixed(2)}
                className={inputClass}
                required
              />
            </label>
            <label className="block">
              <span className="text-[11px] text-muted-foreground">Método</span>
              <select
                value={form.method}
                onChange={(e) =>
                  setForm((s) => ({ ...s, method: e.target.value as PaymentMethod }))
                }
                className={inputClass}
              >
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
                <option value="boleto">Boleto</option>
                <option value="transferencia">Transferência</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-[11px] text-muted-foreground">Notas</span>
            <input
              type="text"
              value={form.notes ?? ''}
              onChange={(e) =>
                setForm((s) => ({ ...s, notes: e.target.value }))
              }
              placeholder="Quem recebeu, comprovante etc."
              className={inputClass}
            />
          </label>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={record.isPending || !form.amount}
            className="rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium disabled:opacity-50 hover:bg-emerald-700"
          >
            {record.isPending ? 'Registrando…' : 'Registrar'}
          </button>
        </form>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: number | string;
  tone?: 'neutral' | 'amber' | 'green';
}) {
  const ring: Record<typeof tone, string> = {
    neutral: 'border-border',
    amber: 'border-amber-300 dark:border-amber-800',
    green: 'border-emerald-300 dark:border-emerald-800',
  };
  return (
    <div className={`rounded-lg border bg-card p-4 ${ring[tone]}`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-serif text-2xl mt-1 tabular-nums">{value}</p>
    </div>
  );
}
