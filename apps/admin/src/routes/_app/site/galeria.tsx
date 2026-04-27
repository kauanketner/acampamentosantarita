import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ApiError } from '@/lib/api';
import {
  type AddPhotoInput,
  type GalleryAlbum,
  type GalleryAlbumInput,
  type GalleryPhoto,
  useAddGalleryPhoto,
  useAdminGalleryAlbum,
  useAdminGalleryAlbums,
  useCreateAlbum,
  useDeleteAlbum,
  useDeleteGalleryPhoto,
  useUpdateAlbum,
} from '@/lib/queries/cms';
import { useAdminEvents } from '@/lib/queries/events';

export const Route = createFileRoute('/_app/site/galeria')({
  component: SiteGaleria,
});

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function SiteGaleria() {
  const { data, isLoading, isError } = useAdminGalleryAlbums();
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl">Galeria</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Álbuns de fotos dos eventos. Apenas álbuns publicados aparecem no app.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Novo álbum
          </button>
        )}
      </header>

      {creating && (
        <AlbumForm
          mode="create"
          onCancel={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar a galeria.
        </div>
      )}

      {data && data.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhum álbum ainda</p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            Crie um álbum, adicione fotos via URL e publique pra aparecer no app.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              open={openId === album.id}
              onToggle={() => setOpenId(openId === album.id ? null : album.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AlbumCard({
  album,
  open,
  onToggle,
}: {
  album: GalleryAlbum;
  open: boolean;
  onToggle: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const update = useUpdateAlbum();
  const remove = useDeleteAlbum();
  const [error, setError] = useState<string | null>(null);

  const onTogglePublish = async () => {
    setError(null);
    try {
      await update.mutateAsync({
        id: album.id,
        input: { published: !album.published },
      });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível salvar.',
      );
    }
  };

  const onDelete = async () => {
    setError(null);
    try {
      await remove.mutateAsync(album.id);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível excluir.',
      );
    }
  };

  if (editing) {
    return (
      <div className="md:col-span-2">
        <AlbumForm
          mode="edit"
          album={album}
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
          album.coverUrl
            ? {
                backgroundImage: `url("${album.coverUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium leading-tight">{album.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {album.slug}
            </p>
          </div>
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              album.published
                ? 'border-emerald-300 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800'
                : 'border-amber-300 bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800'
            }`}
          >
            {album.published ? 'publicado' : 'rascunho'}
          </span>
        </div>
        {album.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {album.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {album.photoCount} {album.photoCount === 1 ? 'foto' : 'fotos'}
          {album.event && ` · ${album.event.name}`}
        </p>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onToggle}
            className="text-xs text-primary underline"
          >
            {open ? 'Fechar fotos' : 'Gerenciar fotos'}
          </button>
          <button
            type="button"
            onClick={onTogglePublish}
            disabled={update.isPending}
            className="text-xs text-muted-foreground hover:text-foreground underline disabled:opacity-50"
          >
            {album.published ? 'Despublicar' : 'Publicar'}
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
            <div className="flex items-center gap-2 ml-auto">
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

        {open && album.published && (
          <PhotosManager albumId={album.id} albumSlug={album.slug} />
        )}
        {open && !album.published && (
          <p className="text-xs text-amber-700 dark:text-amber-400 pt-2">
            Publique o álbum pra gerenciar fotos. (As fotos só ficam visíveis
            quando o álbum está publicado.)
          </p>
        )}
      </div>
    </article>
  );
}

function PhotosManager({
  albumId,
  albumSlug,
}: {
  albumId: string;
  albumSlug: string;
}) {
  const { data, isLoading } = useAdminGalleryAlbum(albumSlug);
  const addPhoto = useAddGalleryPhoto();
  const removePhoto = useDeleteGalleryPhoto();
  const [form, setForm] = useState<AddPhotoInput>({
    imageUrl: '',
    caption: '',
    sortOrder: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.imageUrl) return;
    try {
      await addPhoto.mutateAsync({
        albumId,
        input: {
          imageUrl: form.imageUrl,
          caption: form.caption || null,
          sortOrder: form.sortOrder ?? 0,
        },
      });
      setForm({ imageUrl: '', caption: '', sortOrder: form.sortOrder });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível adicionar.',
      );
    }
  };

  const onRemovePhoto = async (photoId: string) => {
    if (!confirm('Excluir esta foto?')) return;
    try {
      await removePhoto.mutateAsync(photoId);
    } catch (err) {
      alert(
        err instanceof ApiError ? err.message : 'Não foi possível excluir.',
      );
    }
  };

  return (
    <div className="pt-3 border-t space-y-3">
      <form onSubmit={onAdd} className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Adicionar foto
        </p>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
          placeholder="https://..."
          className={inputClass}
          required
        />
        <input
          type="text"
          value={form.caption ?? ''}
          onChange={(e) => setForm((s) => ({ ...s, caption: e.target.value }))}
          placeholder="Legenda (opcional)"
          className={inputClass}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={addPhoto.isPending || !form.imageUrl}
          className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium disabled:opacity-50"
        >
          {addPhoto.isPending ? 'Adicionando…' : 'Adicionar foto'}
        </button>
      </form>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
          Fotos ({data?.photos.length ?? 0})
        </p>
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Carregando…</p>
        ) : data && data.photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {data.photos.map((photo) => (
              <PhotoTile key={photo.id} photo={photo} onRemove={onRemovePhoto} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Sem fotos.</p>
        )}
      </div>
    </div>
  );
}

function PhotoTile({
  photo,
  onRemove,
}: {
  photo: GalleryPhoto;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="relative aspect-square rounded-sm overflow-hidden bg-secondary">
      <img
        src={photo.imageUrl}
        alt={photo.caption ?? ''}
        className="size-full object-cover"
      />
      <button
        type="button"
        onClick={() => onRemove(photo.id)}
        className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white text-xs"
        aria-label="Excluir foto"
      >
        ×
      </button>
    </div>
  );
}

function AlbumForm({
  mode,
  album,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit';
  album?: GalleryAlbum;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const create = useCreateAlbum();
  const update = useUpdateAlbum();
  const { data: events } = useAdminEvents();

  const [form, setForm] = useState({
    name: album?.name ?? '',
    slug: album?.slug ?? '',
    description: album?.description ?? '',
    coverUrl: album?.coverUrl ?? '',
    eventId: album?.eventId ?? '',
    published: album?.published ?? false,
    sortOrder: (album?.sortOrder ?? 0).toString(),
  });
  const [slugTouched, setSlugTouched] = useState(!!album?.slug);
  const [error, setError] = useState<string | null>(null);

  const onNameChange = (v: string) => {
    setForm((s) =>
      slugTouched
        ? { ...s, name: v }
        : { ...s, name: v, slug: slugify(v) },
    );
  };

  const isPending = create.isPending || update.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: GalleryAlbumInput = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      coverUrl: form.coverUrl.trim() || null,
      eventId: form.eventId || null,
      published: form.published,
      sortOrder: Number.parseInt(form.sortOrder || '0', 10),
    };
    try {
      if (mode === 'create') {
        await create.mutateAsync(payload);
      } else if (album) {
        await update.mutateAsync({ id: album.id, input: payload });
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível salvar.',
      );
    }
  };

  const canSubmit =
    form.name.trim().length >= 2 && form.slug.trim().length >= 2 && !isPending;

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-5 space-y-4">
      <h2 className="font-serif text-lg">
        {mode === 'create' ? 'Novo álbum' : 'Editar álbum'}
      </h2>

      <label className="block">
        <span className="text-sm font-medium">Nome</span>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onNameChange(e.target.value)}
          className={`mt-1 ${inputClass}`}
          placeholder="14º Acampamento"
          required
          autoFocus
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Slug (URL)</span>
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
        <span className="text-sm font-medium">Descrição</span>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((s) => ({ ...s, description: e.target.value }))
          }
          rows={3}
          className={`mt-1 ${inputClass}`}
        />
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <span className="text-sm font-medium">Vincular a evento</span>
          <select
            value={form.eventId}
            onChange={(e) => setForm((s) => ({ ...s, eventId: e.target.value }))}
            className={`mt-1 ${inputClass}`}
          >
            <option value="">— Sem vínculo —</option>
            {events?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
        <label className="flex items-center gap-2 text-sm pt-7">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((s) => ({ ...s, published: e.target.checked }))
            }
          />
          Publicado
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {isPending ? 'Salvando…' : mode === 'create' ? 'Criar álbum' : 'Salvar'}
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
