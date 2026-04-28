import { ApiError } from '@/lib/api';
import { brl } from '@/lib/format';
import {
  type ShopProduct,
  type ShopProductInput,
  useAdminShopProducts,
  useCreateShopProduct,
  useDeleteShopProduct,
  useUpdateShopProduct,
} from '@/lib/queries/shop';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_app/lojinha-site/')({
  component: LojinhaSite,
});

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function LojinhaSite() {
  const { data, isLoading } = useAdminShopProducts();
  const [creating, setCreating] = useState(false);

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl">Lojinha do site</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Catálogo público. O comprador clica e abre WhatsApp com mensagem pré-formatada — sem
            checkout.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Novo produto
          </button>
        )}
      </header>

      {creating && (
        <ProductForm
          mode="create"
          onCancel={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhum produto</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Cadastre o primeiro produto pra abastecer o catálogo do site.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ShopProduct }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = useDeleteShopProduct();
  const update = useUpdateShopProduct();
  const cover = product.photos?.[0]?.url || null;

  if (editing) {
    return (
      <div className="md:col-span-2">
        <ProductForm
          mode="edit"
          product={product}
          onCancel={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <article className="rounded-lg border bg-card overflow-hidden">
      <div
        className="h-32 bg-secondary"
        style={
          cover
            ? {
                backgroundImage: `url("${cover}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium leading-tight">{product.name}</p>
            <p className="font-mono text-sm text-muted-foreground mt-0.5">
              {brl(Number(product.price))}
              {product.category && ` · ${product.category}`}
            </p>
          </div>
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              product.active
                ? 'border-emerald-300 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800'
                : 'border-border bg-secondary text-muted-foreground'
            }`}
          >
            {product.active ? 'ativo' : 'inativo'}
          </span>
        </div>
        {product.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {product.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={() => update.mutate({ id: product.id, input: { active: !product.active } })}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            {product.active ? 'Desativar' : 'Ativar'}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-primary underline"
          >
            Editar
          </button>
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-destructive underline ml-auto"
            >
              Excluir
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => remove.mutate(product.id)}
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
        </div>
      </div>
    </article>
  );
}

function ProductForm({
  mode,
  product,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit';
  product?: ShopProduct;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const create = useCreateShopProduct();
  const update = useUpdateShopProduct();

  const initialPhotos = (product?.photos ?? []).map((p) => p.url).join('\n');

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    category: product?.category ?? '',
    photos: initialPhotos,
    whatsappMessageTemplate:
      product?.whatsappMessageTemplate ??
      'Oi! Tenho interesse em {{nome}} ({{preco}}). Tem disponível?',
    active: product?.active ?? true,
    sortOrder: String(product?.sortOrder ?? 0),
  });
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const photos = form.photos
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean)
      .map((url) => ({ url }));

    const payload: ShopProductInput = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price).toFixed(2),
      photos,
      category: form.category.trim() || null,
      active: form.active,
      sortOrder: Number.parseInt(form.sortOrder || '0', 10),
      whatsappMessageTemplate: form.whatsappMessageTemplate.trim() || null,
    };
    try {
      if (mode === 'create') {
        await create.mutateAsync(payload);
      } else if (product) {
        await update.mutateAsync({ id: product.id, input: payload });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  const canSubmit = form.name.trim().length >= 2 && !!form.price && !isPending;

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="font-serif text-lg">
        {mode === 'create' ? 'Novo produto' : 'Editar produto'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Nome</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            required
            autoFocus
          />
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
            required
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Descrição</span>
        <textarea
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          rows={3}
          className={`mt-1 ${inputClass}`}
        />
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Categoria</span>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="Camisetas, Acessórios…"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Ordem</span>
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => setForm((s) => ({ ...s, sortOrder: e.target.value }))}
            className={`mt-1 ${inputClass}`}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Fotos (uma URL por linha)</span>
        <textarea
          value={form.photos}
          onChange={(e) => setForm((s) => ({ ...s, photos: e.target.value }))}
          rows={3}
          className={`mt-1 ${inputClass} font-mono text-xs`}
          placeholder="https://...&#10;https://..."
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Mensagem WhatsApp</span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          Use <code>{'{{nome}}'}</code> e <code>{'{{preco}}'}</code> como placeholders.
        </span>
        <textarea
          value={form.whatsappMessageTemplate}
          onChange={(e) => setForm((s) => ({ ...s, whatsappMessageTemplate: e.target.value }))}
          rows={2}
          className={`mt-1 ${inputClass}`}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm((s) => ({ ...s, active: e.target.checked }))}
        />
        Ativo (visível no site)
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
