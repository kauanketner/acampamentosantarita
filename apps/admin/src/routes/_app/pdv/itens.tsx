import { ApiError } from '@/lib/api';
import { brl } from '@/lib/format';
import {
  type PosCategory,
  type PosItem,
  type PosItemInput,
  useCreatePosItem,
  useDeletePosItem,
  usePosItems,
  useUpdatePosItem,
} from '@/lib/queries/pos';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_app/pdv/itens')({
  component: PdvItens,
});

const categoryLabel: Record<PosCategory, string> = {
  cantina: 'Cantina',
  lojinha: 'Lojinha',
  outros: 'Outros',
};

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function PdvItens() {
  const { data, isLoading } = usePosItems();
  const [creating, setCreating] = useState(false);

  const grouped = (data ?? []).reduce<Record<PosCategory, PosItem[]>>(
    (acc, item) => {
      const c = item.category;
      if (!acc[c]) acc[c] = [];
      acc[c].push(item);
      return acc;
    },
    { cantina: [], lojinha: [], outros: [] },
  );

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl">PDV — Itens</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Catálogo de produtos vendidos durante eventos (cantina, lojinha, outros).
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Novo item
          </button>
        )}
      </header>

      {creating && (
        <ItemForm
          mode="create"
          onCancel={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhum item ainda</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Crie itens pra usar nos lançamentos do PDV.
          </p>
        </div>
      )}

      {(['cantina', 'lojinha', 'outros'] as PosCategory[]).map(
        (cat) =>
          grouped[cat].length > 0 && (
            <section key={cat} className="space-y-2">
              <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
                {categoryLabel[cat]} ({grouped[cat].length})
              </h2>
              <div className="rounded-lg border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                      <th className="px-4 py-2 font-medium">Item</th>
                      <th className="px-4 py-2 font-medium">SKU</th>
                      <th className="px-4 py-2 font-medium text-right">Preço</th>
                      <th className="px-4 py-2 font-medium text-right">Estoque</th>
                      <th className="px-4 py-2 font-medium">Ativo</th>
                      <th className="px-4 py-2 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[cat].map((item) => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ),
      )}
    </div>
  );
}

function ItemRow({ item }: { item: PosItem }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = useDeletePosItem();
  const update = useUpdatePosItem();

  if (editing) {
    return (
      <tr className="border-b last:border-b-0">
        <td colSpan={6} className="p-3 bg-secondary/20">
          <ItemForm
            mode="edit"
            item={item}
            onCancel={() => setEditing(false)}
            onSaved={() => setEditing(false)}
          />
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b last:border-b-0 hover:bg-secondary/30 transition">
      <td className="px-4 py-2 font-medium">{item.name}</td>
      <td className="px-4 py-2 text-muted-foreground font-mono text-xs">{item.sku ?? '—'}</td>
      <td className="px-4 py-2 text-right font-mono">{brl(Number(item.price))}</td>
      <td className="px-4 py-2 text-right text-muted-foreground">{item.stock ?? '∞'}</td>
      <td className="px-4 py-2">
        <button
          type="button"
          onClick={() => update.mutate({ id: item.id, input: { active: !item.active } })}
          className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
            item.active
              ? 'border-emerald-300 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800'
              : 'border-border bg-secondary text-muted-foreground'
          }`}
        >
          {item.active ? 'sim' : 'não'}
        </button>
      </td>
      <td className="px-4 py-2 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-primary underline mr-2"
        >
          Editar
        </button>
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-xs text-destructive underline"
          >
            Excluir
          </button>
        ) : (
          <span className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => remove.mutate(item.id)}
              disabled={remove.isPending}
              className="rounded-md bg-destructive text-white px-2 py-0.5 text-xs disabled:opacity-50"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-muted-foreground underline"
            >
              Voltar
            </button>
          </span>
        )}
      </td>
    </tr>
  );
}

function ItemForm({
  mode,
  item,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit';
  item?: PosItem;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const create = useCreatePosItem();
  const update = useUpdatePosItem();
  const [form, setForm] = useState({
    name: item?.name ?? '',
    sku: item?.sku ?? '',
    category: (item?.category ?? 'cantina') as PosCategory,
    price: item?.price ?? '',
    stock: item?.stock != null ? String(item.stock) : '',
    active: item?.active ?? true,
  });
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: PosItemInput = {
      name: form.name.trim(),
      sku: form.sku.trim() || null,
      category: form.category,
      price: Number(form.price).toFixed(2),
      stock: form.stock ? Number.parseInt(form.stock, 10) : null,
      active: form.active,
    };
    try {
      if (mode === 'create') {
        await create.mutateAsync(payload);
      } else if (item) {
        await update.mutateAsync({ id: item.id, input: payload });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  const canSubmit = form.name.trim().length >= 2 && !!form.price && !isPending;

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="font-serif text-lg">{mode === 'create' ? 'Novo item' : 'Editar item'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Nome</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="Pão na chapa"
            required
            autoFocus
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">SKU</span>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))}
            className={`mt-1 ${inputClass} font-mono`}
            placeholder="opcional"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Categoria</span>
          <select
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as PosCategory }))}
            className={`mt-1 ${inputClass}`}
          >
            <option value="cantina">Cantina</option>
            <option value="lojinha">Lojinha</option>
            <option value="outros">Outros</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Preço (R$)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="5.00"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Estoque</span>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="vazio = ilimitado"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm((s) => ({ ...s, active: e.target.checked }))}
        />
        Ativo
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          {isPending ? '…' : mode === 'create' ? 'Criar' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground underline"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
