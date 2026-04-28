import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ApiError } from '@/lib/api';
import {
  type HomeBlock,
  type HomeBlockInput,
  type HomeBlockType,
  useCreateHomeBlock,
  useDeleteHomeBlock,
  useHomeBlocks,
  useUpdateHomeBlock,
} from '@/lib/queries/cms';

export const Route = createFileRoute('/_app/site/home')({
  component: SiteHome,
});

const typeLabel: Record<HomeBlockType, string> = {
  hero: 'Hero (banner principal)',
  call_to_action: 'CTA (chamada)',
  text: 'Texto livre',
  gallery: 'Galeria',
  testimonial: 'Depoimento',
  numbers: 'Números/estatísticas',
};

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function SiteHome() {
  const { data, isLoading } = useHomeBlocks();
  const [creating, setCreating] = useState(false);

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl">Home do site</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Blocos da home do site público. O conteúdo é JSON flexível por
            tipo (hero, CTA, texto, galeria, depoimento, números).
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Novo bloco
          </button>
        )}
      </header>

      {creating && (
        <BlockForm
          mode="create"
          orderHint={(data?.length ?? 0) + 1}
          onCancel={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhum bloco</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Adicione o primeiro bloco — ele vai aparecer na home do site.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <ol className="space-y-2">
          {data.map((b, i) => (
            <BlockRow key={b.id} block={b} index={i} />
          ))}
        </ol>
      )}
    </div>
  );
}

function BlockRow({ block, index }: { block: HomeBlock; index: number }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = useDeleteHomeBlock();
  const update = useUpdateHomeBlock();

  if (editing) {
    return (
      <BlockForm
        mode="edit"
        block={block}
        orderHint={block.order}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  return (
    <li className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md border bg-secondary text-xs px-2 py-0.5 font-mono">
              #{index + 1}
            </span>
            <p className="font-medium text-sm">{typeLabel[block.type]}</p>
            {!block.active && (
              <span className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                inativo
              </span>
            )}
          </div>
          <pre className="text-[11px] text-muted-foreground bg-secondary/40 rounded p-2 mt-2 overflow-x-auto max-h-40">
            {JSON.stringify(block.content, null, 2)}
          </pre>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() =>
              update.mutate({ id: block.id, input: { active: !block.active } })
            }
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            {block.active ? 'Desativar' : 'Ativar'}
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
            <span className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => remove.mutate(block.id)}
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
    </li>
  );
}

function BlockForm({
  mode,
  block,
  orderHint,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit';
  block?: HomeBlock;
  orderHint: number;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const create = useCreateHomeBlock();
  const update = useUpdateHomeBlock();

  const [type, setType] = useState<HomeBlockType>(block?.type ?? 'hero');
  const [order, setOrder] = useState(String(block?.order ?? orderHint));
  const [active, setActive] = useState(block?.active ?? true);
  const [contentText, setContentText] = useState(
    block ? JSON.stringify(block.content, null, 2) : '{\n  \n}',
  );
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let content: Record<string, unknown>;
    try {
      content = JSON.parse(contentText);
    } catch {
      setError('JSON inválido. Verifique a sintaxe (vírgulas, aspas).');
      return;
    }

    const payload: HomeBlockInput = {
      type,
      content,
      order: Number.parseInt(order || '0', 10),
      active,
    };

    try {
      if (mode === 'create') {
        await create.mutateAsync(payload);
      } else if (block) {
        await update.mutateAsync({ id: block.id, input: payload });
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível salvar.',
      );
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="font-serif text-lg">
        {mode === 'create' ? 'Novo bloco' : 'Editar bloco'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Tipo</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as HomeBlockType)}
            className={`mt-1 ${inputClass}`}
          >
            {(Object.keys(typeLabel) as HomeBlockType[]).map((t) => (
              <option key={t} value={t}>
                {typeLabel[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Ordem</span>
          <input
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Conteúdo (JSON)</span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          Por exemplo, hero: {'{ "title": "...", "subtitle": "...", "image": "..." }'}.
          Cada tipo tem campos próprios — combinado com o site público.
        </span>
        <textarea
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          rows={10}
          className={`mt-1 ${inputClass} font-mono text-xs`}
          required
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Ativo
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={isPending}
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
