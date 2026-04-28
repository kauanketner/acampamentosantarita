import { ApiError } from '@/lib/api';
import {
  type Post,
  type PostInput,
  useAdminPosts,
  useCreatePost,
  useDeletePost,
  useUpdatePost,
} from '@/lib/queries/cms';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_app/site/posts')({
  component: SitePosts,
});

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function SitePosts() {
  const { data, isLoading } = useAdminPosts();
  const [creating, setCreating] = useState(false);

  const drafts = (data ?? []).filter((p) => !p.publishedAt);
  const published = (data ?? []).filter((p) => p.publishedAt);

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl">Posts (blog)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Posts do blog do site público. Conteúdo em texto livre (markdown funciona).
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Novo post
          </button>
        )}
      </header>

      {creating && (
        <PostForm
          mode="create"
          onCancel={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhum post ainda</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Quando você publicar o primeiro post, ele aparece no blog do site.
          </p>
        </div>
      )}

      {drafts.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            Rascunhos ({drafts.length})
          </h2>
          {drafts.map((p) => (
            <PostRow key={p.id} post={p} />
          ))}
        </section>
      )}

      {published.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            Publicados ({published.length})
          </h2>
          {published.map((p) => (
            <PostRow key={p.id} post={p} />
          ))}
        </section>
      )}
    </div>
  );
}

function PostRow({ post }: { post: Post }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = useDeletePost();
  const update = useUpdatePost();

  if (editing) {
    return (
      <PostForm
        mode="edit"
        post={post}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  const onTogglePublish = () => {
    update.mutate({ id: post.id, input: { publish: !post.publishedAt } });
  };

  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-tight">
            {post.title}
            {post.publishedAt ? (
              <span className="ml-2 text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                publicado
              </span>
            ) : (
              <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                rascunho
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">/{post.slug}</p>
          {post.excerpt && <p className="text-sm text-muted-foreground mt-1.5">{post.excerpt}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onTogglePublish}
            disabled={update.isPending}
            className="text-xs text-muted-foreground hover:text-foreground underline disabled:opacity-50"
          >
            {post.publishedAt ? 'Despublicar' : 'Publicar'}
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
                onClick={() => remove.mutate(post.id)}
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

function PostForm({
  mode,
  post,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit';
  post?: Post;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const create = useCreatePost();
  const update = useUpdatePost();
  const tagsString = post && Array.isArray(post.tags) ? (post.tags as string[]).join(', ') : '';

  const [form, setForm] = useState({
    slug: post?.slug ?? '',
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    coverUrl: post?.coverUrl ?? '',
    tags: tagsString,
  });
  const [slugTouched, setSlugTouched] = useState(!!post?.slug);
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;
  const isPublished = !!post?.publishedAt;

  const onTitleChange = (v: string) => {
    setForm((s) => (slugTouched ? { ...s, title: v } : { ...s, title: v, slug: slugify(v) }));
  };

  const buildPayload = (publish: boolean): PostInput => ({
    slug: form.slug.trim(),
    title: form.title.trim(),
    excerpt: form.excerpt.trim() || null,
    content: form.content.trim() || null,
    coverUrl: form.coverUrl.trim() || null,
    tags: form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    publish,
  });

  const submit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'create') {
        await create.mutateAsync(buildPayload(publish));
      } else if (post) {
        await update.mutateAsync({ id: post.id, input: buildPayload(publish) });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  const canSubmit = form.title.trim().length >= 2 && form.slug.trim().length >= 2 && !isPending;

  return (
    <form
      onSubmit={(e) => submit(e, isPublished)}
      className="rounded-lg border bg-card p-5 space-y-3"
    >
      <h2 className="font-serif text-lg">{mode === 'create' ? 'Novo post' : 'Editar post'}</h2>
      <label className="block">
        <span className="text-sm font-medium">Título</span>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`mt-1 ${inputClass}`}
          required
          autoFocus
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Slug</span>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setForm((s) => ({ ...s, slug: slugify(e.target.value) }));
          }}
          className={`mt-1 ${inputClass} font-mono`}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Resumo</span>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))}
          rows={2}
          className={`mt-1 ${inputClass}`}
          placeholder="2-3 linhas que aparecem na lista do blog"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Conteúdo</span>
        <textarea
          value={form.content}
          onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
          rows={12}
          className={`mt-1 ${inputClass} font-mono text-xs`}
          placeholder="Markdown funciona — # Título, **negrito**, [link](url)…"
        />
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">URL da capa</span>
          <input
            type="url"
            value={form.coverUrl}
            onChange={(e) => setForm((s) => ({ ...s, coverUrl: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="https://..."
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Tags (separadas por vírgula)</span>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="espiritualidade, comunidade"
          />
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        {!isPublished && (
          <button
            type="button"
            onClick={(e) => submit(e, false)}
            disabled={!canSubmit}
            className="rounded-md border px-4 py-1.5 text-sm font-medium hover:bg-secondary disabled:opacity-50"
          >
            Salvar rascunho
          </button>
        )}
        <button
          type="button"
          onClick={(e) => submit(e, true)}
          disabled={!canSubmit}
          className="rounded-md bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          {isPending ? '…' : isPublished ? 'Salvar' : 'Publicar agora'}
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
