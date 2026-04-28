import { ApiError } from '@/lib/api';
import {
  type Announcement,
  type AnnouncementAudience,
  type AnnouncementInput,
  useAdminAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useUpdateAnnouncement,
} from '@/lib/queries/announcements';
import { useAdminEvents } from '@/lib/queries/events';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_app/comunicacao/avisos')({
  component: Avisos,
});

const audienceLabel: Record<AnnouncementAudience, string> = {
  todos: 'Comunidade toda',
  participantes_evento: 'Inscritos no evento',
  equipistas: 'Equipistas',
  tribo_x: 'Tribo específica',
  equipe_x: 'Equipe específica',
};

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function Avisos() {
  const { data, isLoading, isError } = useAdminAnnouncements();
  const [creating, setCreating] = useState(false);

  const published = data?.filter((a) => a.publishedAt) ?? [];
  const drafts = data?.filter((a) => !a.publishedAt) ?? [];

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl">Avisos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mensagens da coordenação que aparecem no app dos campistas.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Novo aviso
          </button>
        )}
      </header>

      {creating && (
        <AnnouncementForm
          mode="create"
          onCancel={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar os avisos.
        </div>
      )}

      {data && data.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhum aviso ainda</p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            Quando você publicar um aviso, ele aparece aqui — e na lista de avisos do app dos
            campistas (se publicado).
          </p>
        </div>
      )}

      {drafts.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            Rascunhos ({drafts.length})
          </h2>
          {drafts.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </section>
      )}

      {published.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            Publicados ({published.length})
          </h2>
          {published.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </section>
      )}
    </div>
  );
}

function AnnouncementCard({ announcement: a }: { announcement: Announcement }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = useDeleteAnnouncement();
  const update = useUpdateAnnouncement();
  const [error, setError] = useState<string | null>(null);

  if (editing) {
    return (
      <AnnouncementForm
        mode="edit"
        announcement={a}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  const onDelete = async () => {
    setError(null);
    try {
      await remove.mutateAsync(a.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível excluir.');
    }
  };

  const onTogglePublish = async () => {
    setError(null);
    try {
      await update.mutateAsync({
        id: a.id,
        input: { publish: !a.publishedAt },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  return (
    <article className="rounded-lg border bg-card p-5 space-y-3">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge tone={a.publishedAt ? 'green' : 'amber'}>
              {a.publishedAt ? 'publicado' : 'rascunho'}
            </Badge>
            <span>{audienceLabel[a.targetAudience]}</span>
            {a.event && <span>· {a.event.name}</span>}
            {a.sendPush && <span>· push</span>}
          </div>
          <h3 className="font-serif text-xl mt-1.5 leading-tight">{a.title}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
            {a.body}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">
            {a.publishedAt
              ? `Publicado em ${formatDateTime(a.publishedAt)}`
              : `Criado em ${formatDateTime(a.createdAt)}`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onTogglePublish}
            disabled={update.isPending}
            className="rounded-md border px-3 py-1 text-xs hover:bg-secondary disabled:opacity-50"
          >
            {update.isPending ? '…' : a.publishedAt ? 'Despublicar' : 'Publicar'}
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
                className="rounded-md bg-destructive text-white px-2.5 py-1 text-xs font-medium disabled:opacity-50"
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
      </header>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </article>
  );
}

function AnnouncementForm({
  mode,
  announcement,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit';
  announcement?: Announcement;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const create = useCreateAnnouncement();
  const update = useUpdateAnnouncement();
  const { data: events } = useAdminEvents();

  const [form, setForm] = useState({
    title: announcement?.title ?? '',
    body: announcement?.body ?? '',
    imageUrl: announcement?.imageUrl ?? '',
    eventId: announcement?.eventId ?? '',
    targetAudience: (announcement?.targetAudience ?? 'todos') as AnnouncementAudience,
    sendPush: announcement?.sendPush ?? false,
  });
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;

  const onSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setError(null);

    const payload: AnnouncementInput = {
      title: form.title.trim(),
      body: form.body.trim(),
      imageUrl: form.imageUrl.trim() || null,
      eventId: form.eventId || null,
      targetAudience: form.targetAudience,
      sendPush: form.sendPush,
      publish,
    };

    try {
      if (mode === 'create') {
        await create.mutateAsync(payload);
      } else if (announcement) {
        await update.mutateAsync({ id: announcement.id, input: payload });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  const isPublished = announcement?.publishedAt != null;
  const canSubmit = form.title.trim().length >= 2 && form.body.trim().length >= 2 && !isPending;

  return (
    <form
      className="rounded-lg border bg-card p-5 space-y-4"
      onSubmit={(e) => onSubmit(e, isPublished)}
    >
      <h2 className="font-serif text-lg">{mode === 'create' ? 'Novo aviso' : 'Editar aviso'}</h2>

      <label className="block">
        <span className="text-sm font-medium">Título</span>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          className={`mt-1 ${inputClass}`}
          placeholder="Reunião de equipistas"
          required
          autoFocus
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Mensagem</span>
        <textarea
          value={form.body}
          onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
          rows={5}
          className={`mt-1 ${inputClass}`}
          placeholder="Mensagem completa que aparece no app"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">URL da imagem</span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          Opcional. Aparece no card do aviso.
        </span>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
          className={`mt-1 ${inputClass}`}
          placeholder="https://..."
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Quem recebe</span>
          <select
            value={form.targetAudience}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                targetAudience: e.target.value as AnnouncementAudience,
              }))
            }
            className={`mt-1 ${inputClass}`}
          >
            {(Object.keys(audienceLabel) as AnnouncementAudience[]).map((a) => (
              <option key={a} value={a}>
                {audienceLabel[a]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Vincular a evento</span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            Opcional. Mostra o nome do evento no aviso.
          </span>
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

      <label className="flex items-start gap-3 rounded-md border bg-background p-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.sendPush}
          onChange={(e) => setForm((s) => ({ ...s, sendPush: e.target.checked }))}
          className="mt-0.5"
        />
        <div>
          <p className="text-sm font-medium">Enviar push notification</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Avisa pessoalmente os destinatários no aparelho. (Push entra em produção em breve — por
            enquanto só registra a flag.)
          </p>
        </div>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        {!isPublished && (
          <button
            type="button"
            onClick={(e) => onSubmit(e, false)}
            disabled={!canSubmit}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
          >
            {mode === 'create' ? 'Salvar como rascunho' : 'Salvar rascunho'}
          </button>
        )}
        <button
          type="button"
          onClick={(e) => onSubmit(e, true)}
          disabled={!canSubmit}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {isPending ? 'Salvando…' : isPublished ? 'Salvar alterações' : 'Publicar agora'}
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

function Badge({
  tone,
  children,
}: {
  tone: 'green' | 'amber';
  children: React.ReactNode;
}) {
  const cls =
    tone === 'green'
      ? 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800'
      : 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cls}`}
    >
      {children}
    </span>
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
