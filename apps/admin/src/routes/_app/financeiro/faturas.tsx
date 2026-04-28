import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { Badge, type Tone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, Input, Select } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { Toolbar, ToolbarSearch } from '@/components/ui/Toolbar';
import { Table, THead, TH, TBody, TR, TD } from '@/components/ui/Table';
import { ApiError } from '@/lib/api';
import { brl, formatDate, maskPhoneDisplay } from '@/lib/format';
import {
  type AdminInvoice,
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

const statusInfo: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  pago: { label: 'Pago', tone: 'success' },
  pendente: { label: 'Pendente', tone: 'warning' },
  parcial: { label: 'Parcial', tone: 'warning' },
  vencido: { label: 'Vencido', tone: 'danger' },
  cancelado: { label: 'Cancelado', tone: 'neutral' },
  reembolsado: { label: 'Reembolsado', tone: 'neutral' },
};

const typeLabel: Record<AdminInvoice['type'], string> = {
  registration: 'Inscrição',
  pos: 'PDV',
  shop: 'Lojinha',
  other: 'Outro',
};

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
    <div className="px-8 py-8 max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Financeiro · Cobranças"
        title="Faturas"
        description="Cobranças geradas pelas inscrições e pelo PDV. Você pode registrar pagamento manual quando alguém pagar fora do app."
      />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label="Total de faturas" value={totals.count} />
        <Stat
          label="Em aberto"
          value={brl(totals.open)}
          tone={totals.open > 0 ? 'warning' : 'neutral'}
        />
        <Stat
          label="Recebido"
          value={brl(totals.paid)}
          tone={totals.paid > 0 ? 'success' : 'neutral'}
        />
      </section>

      <Toolbar>
        <ToolbarSearch
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome…"
        />
        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'all' | InvoiceStatus)
          }
          className="w-48"
        >
          <option value="all">Todos status</option>
          {(Object.keys(statusInfo) as InvoiceStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusInfo[s].label}
            </option>
          ))}
        </Select>
      </Toolbar>

      {isLoading && (
        <p className="text-sm text-(color:--color-muted-foreground)">
          Carregando…
        </p>
      )}

      {isError && (
        <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) px-4 py-3 text-sm text-(color:--color-danger)">
          Não conseguimos buscar as faturas.
        </div>
      )}

      {data && filtered.length === 0 && (
        <EmptyState
          icon={
            <svg viewBox="0 0 36 36" fill="none" className="size-9" aria-hidden>
              <rect
                x="7"
                y="5"
                width="22"
                height="26"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M12 11H24M12 16H24M12 21H19"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          }
          title={
            data.length === 0
              ? 'Sem faturas ainda'
              : 'Nenhuma fatura corresponde ao filtro'
          }
          description={
            data.length === 0
              ? 'Faturas são criadas automaticamente quando alguém se inscreve com pagamento ou compra no PDV.'
              : 'Tente outro filtro de status ou outro nome na busca.'
          }
        />
      )}

      {filtered.length > 0 && (
        <Table>
          <THead>
            <tr>
              <TH>Pessoa</TH>
              <TH>Tipo</TH>
              <TH align="right">Valor</TH>
              <TH>Status</TH>
              <TH align="right">Ações</TH>
            </tr>
          </THead>
          <TBody>
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
          </TBody>
        </Table>
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
      <TR>
        <TD>
          <p className="font-medium leading-tight">{invoice.person.fullName}</p>
          <p className="text-[11px] text-(color:--color-muted-foreground) mt-0.5 font-mono tabular-nums">
            {invoice.person.mobilePhone
              ? maskPhoneDisplay(invoice.person.mobilePhone)
              : '—'}
          </p>
          {invoice.description && (
            <p className="text-[11px] text-(color:--color-muted-foreground) mt-1 max-w-md">
              {invoice.description}
            </p>
          )}
        </TD>
        <TD className="text-(color:--color-muted-foreground)">
          {typeLabel[invoice.type]}
        </TD>
        <TD align="right" className="whitespace-nowrap font-mono tabular-nums">
          <p>{brl(total)}</p>
          <p className="text-[11px] text-(color:--color-muted-foreground) mt-0.5">
            {paid > 0 ? `Pago ${brl(paid)}` : 'Sem pagamento'}
          </p>
          {remaining > 0 && invoice.status !== 'cancelado' && (
            <p className="text-[11px] text-(color:--color-warning) mt-0.5">
              Falta {brl(remaining)}
            </p>
          )}
        </TD>
        <TD>
          <Badge tone={status.tone} dot={invoice.status === 'vencido'}>
            {status.label}
          </Badge>
        </TD>
        <TD align="right">
          <button
            type="button"
            onClick={onToggle}
            className="text-[11px] text-(color:--color-primary) hover:underline underline-offset-2"
          >
            {open ? 'Fechar' : 'Detalhes'}
          </button>
        </TD>
      </TR>
      {open && (
        <TR>
          <TD className="bg-(color:--color-surface-2)/50" colSpan={5}>
            <InvoiceDetail invoiceId={invoice.id} />
          </TD>
        </TR>
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
    return (
      <p className="text-xs text-(color:--color-muted-foreground)">
        Carregando…
      </p>
    );
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
      <div className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
          Pagamentos · {data.payments.length}
        </p>
        {data.payments.length === 0 ? (
          <p className="text-xs text-(color:--color-muted-foreground)">
            Nenhum pagamento registrado ainda.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {data.payments.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium tabular-nums">
                    <span className="font-mono uppercase tracking-wider text-[10px] text-(color:--color-muted-foreground) mr-1">
                      {p.method}
                    </span>
                    {brl(Number(p.amount))}
                  </p>
                  <p className="text-[10px] text-(color:--color-subtle) mt-0.5">
                    {formatDate(p.paidAt)}
                    {p.notes && ` · ${p.notes}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeletePayment(p.id)}
                  className="text-[10px] text-(color:--color-danger) hover:underline underline-offset-2"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {canRegister && (
        <form onSubmit={onSubmit} className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
            Registrar pagamento
          </p>
          <p className="text-[11px] text-(color:--color-muted-foreground)">
            Restante:{' '}
            <span className="font-mono tabular-nums text-(color:--color-foreground)">
              {brl(remaining)}
            </span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Valor">
              <Input
                type="number"
                step="0.01"
                min={0}
                max={remaining}
                value={form.amount}
                onChange={(e) =>
                  setForm((s) => ({ ...s, amount: e.target.value }))
                }
                placeholder={remaining.toFixed(2)}
                required
              />
            </Field>
            <Field label="Método">
              <Select
                value={form.method}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    method: e.target.value as PaymentMethod,
                  }))
                }
              >
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
                <option value="boleto">Boleto</option>
                <option value="transferencia">Transferência</option>
              </Select>
            </Field>
          </div>
          <Field label="Notas">
            <Input
              type="text"
              value={form.notes ?? ''}
              onChange={(e) =>
                setForm((s) => ({ ...s, notes: e.target.value }))
              }
              placeholder="Quem recebeu, comprovante etc."
            />
          </Field>
          {error && <p className="text-xs text-(color:--color-danger)">{error}</p>}
          <Button
            type="submit"
            size="sm"
            disabled={record.isPending || !form.amount}
          >
            {record.isPending ? 'Registrando…' : 'Registrar pagamento'}
          </Button>
        </form>
      )}
    </div>
  );
}
