import { ApiError } from '@/lib/api';
import {
  type FaqInput,
  type FaqItem,
  useAdminFaq,
  useCreateFaq,
  useDeleteFaq,
  useUpdateFaq,
} from '@/lib/queries/cms';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_app/site/faq')({
  component: SiteFaq,
});

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function SiteFaq() {
  const { data, isLoading, isError } = useAdminFaq();
  const [creating, setCreating] = useState(false);

  const grouped = (data ?? []).reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category?.trim() ? item.category : 'Sem categoria';
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl">FAQ</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Perguntas e respostas que aparecem no app dos campistas.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Nova pergunta
          </button>
        )}
      </header>

      {creating && (
        <FaqForm
          mode="create"
          onCancel={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar as perguntas.
        </div>
      )}

      {data && data.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhuma pergunta ainda</p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            Quando você publicar a primeira pergunta, ela aparece no app.
          </p>
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            {category} ({items.length})
          </h2>
          {items.map((item) => (
            <FaqRow key={item.id} item={item} />
          ))}
        </section>
      ))}
    </div>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = useDeleteFaq();
  const update = useUpdateFaq();
  const [error, setError] = useState<string | null>(null);

  if (editing) {
    return (
      <FaqForm
        mode="edit"
        item={item}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  const onTogglePublish = async () => {
    setError(null);
    try {
      await update.mutateAsync({
        id: item.id,
        input: { published: !item.published },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  const onDelete = async () => {
    setError(null);
    try {
      await remove.mutateAsync(item.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível excluir.');
    }
  };

  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug">
            {item.question}
            {!item.published && (
              <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                rascunho
              </span>
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
            {item.answer}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onTogglePublish}
            disabled={update.isPending}
            className="text-xs text-muted-foreground hover:text-foreground underline disabled:opacity-50"
          >
            {item.published ? 'Despublicar' : 'Publicar'}
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
              className="text-xs text-destructive underline"
            >
              Excluir
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDelete}
                disabled={remove.isPending}
                className="rounded-md bg-destructive text-white px-2 py-0.5 text-xs disabled:opacity-50"
              >
                {remove.isPending ? '…' : 'Confirmar'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-muted-foreground underline"
              >
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
    </article>
  );
}

function FaqForm({
  mode,
  item,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit';
  item?: FaqItem;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const create = useCreateFaq();
  const update = useUpdateFaq();

  const [form, setForm] = useState({
    question: item?.question ?? '',
    answer: item?.answer ?? '',
    category: item?.category ?? '',
    sortOrder: (item?.sortOrder ?? 0).toString(),
    published: item?.published ?? true,
  });
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: FaqInput = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || null,
      sortOrder: Number.parseInt(form.sortOrder || '0', 10),
      published: form.published,
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

  const canSubmit =
    form.question.trim().length >= 2 && form.answer.trim().length >= 2 && !isPending;

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-5 space-y-4">
      <h2 className="font-serif text-lg">
        {mode === 'create' ? 'Nova pergunta' : 'Editar pergunta'}
      </h2>

      <label className="block">
        <span className="text-sm font-medium">Pergunta</span>
        <input
          type="text"
          value={form.question}
          onChange={(e) => setForm((s) => ({ ...s, question: e.target.value }))}
          className={`mt-1 ${inputClass}`}
          required
          autoFocus
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Resposta</span>
        <textarea
          value={form.answer}
          onChange={(e) => setForm((s) => ({ ...s, answer: e.target.value }))}
          rows={4}
          className={`mt-1 ${inputClass}`}
          required
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Categoria</span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            Opcional. Agrupa perguntas semelhantes.
          </span>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="Inscrições"
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

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm((s) => ({ ...s, published: e.target.checked }))}
        />
        Publicado (visível no app)
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {isPending ? 'Salvando…' : mode === 'create' ? 'Adicionar' : 'Salvar'}
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
