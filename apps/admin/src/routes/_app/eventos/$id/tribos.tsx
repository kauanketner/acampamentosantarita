import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { ApiError } from '@/lib/api';
import { useAdminEvent } from '@/lib/queries/events';
import { useEventRegistrations } from '@/lib/queries/registrations';
import {
  type TribeMemberRole,
  type TribeWithMembers,
  useAddTribeMember,
  useCreateTribe,
  useDeleteTribe,
  useEventTribes,
  useRemoveTribeMember,
  useRevealTribesForEvent,
  useUpdateTribe,
} from '@/lib/queries/tribes';

export const Route = createFileRoute('/_app/eventos/$id/tribos')({
  component: EventoTribos,
});

const roleLabel: Record<TribeMemberRole, string> = {
  lider: 'Líder',
  vice_lider: 'Vice-líder',
  campista: 'Campista',
};

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function EventoTribos() {
  const { id } = Route.useParams();
  const { data: event } = useAdminEvent(id);
  const { data: tribes, isLoading, isError } = useEventTribes(id);
  const reveal = useRevealTribesForEvent();
  const [creating, setCreating] = useState(false);
  const [revealMessage, setRevealMessage] = useState<string | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);

  const totalMembers = useMemo(
    () => tribes?.reduce((acc, t) => acc + t.members.length, 0) ?? 0,
    [tribes],
  );
  const unrevealed = useMemo(
    () =>
      tribes?.reduce(
        (acc, t) => acc + t.members.filter((m) => !m.isRevealedToMember).length,
        0,
      ) ?? 0,
    [tribes],
  );

  const onReveal = async () => {
    setRevealError(null);
    setRevealMessage(null);
    if (!confirm('Liberar a tribo pra todos os membros? Eles vão ver no app.'))
      return;
    try {
      const res = await reveal.mutateAsync(id);
      setRevealMessage(
        res.revealed === 0
          ? 'Nada a revelar — todos já estavam liberados.'
          : `${res.revealed} ${res.revealed === 1 ? 'membro liberado' : 'membros liberados'}.`,
      );
    } catch (err) {
      setRevealError(
        err instanceof ApiError ? err.message : 'Não foi possível revelar agora.',
      );
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header className="space-y-2">
        <Link
          to="/eventos/$id"
          params={{ id }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← {event?.name ?? 'Evento'}
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-2xl">Tribos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {tribes?.length ?? 0} {tribes?.length === 1 ? 'tribo' : 'tribos'} ·{' '}
              {totalMembers} {totalMembers === 1 ? 'membro' : 'membros'}
              {unrevealed > 0 && ` · ${unrevealed} não revelado(s)`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
            >
              Nova tribo
            </button>
            <button
              type="button"
              onClick={onReveal}
              disabled={reveal.isPending || totalMembers === 0 || unrevealed === 0}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
            >
              {reveal.isPending ? 'Revelando…' : 'Revelar tribos'}
            </button>
          </div>
        </div>
        {revealMessage && (
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            {revealMessage}
          </p>
        )}
        {revealError && (
          <p className="text-sm text-destructive">{revealError}</p>
        )}
      </header>

      {creating && (
        <NewTribeForm
          eventId={id}
          orderHint={(tribes?.length ?? 0) + 1}
          onCancel={() => setCreating(false)}
          onCreated={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar as tribos.
        </div>
      )}

      {tribes && tribes.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhuma tribo ainda</p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            Crie a primeira tribo deste evento. Você pode adicionar membros depois.
          </p>
        </div>
      )}

      {tribes && tribes.length > 0 && (
        <div className="space-y-4">
          {tribes.map((t) => (
            <TribeCard key={t.id} tribe={t} eventId={id} />
          ))}
        </div>
      )}
    </div>
  );
}

function NewTribeForm({
  eventId,
  orderHint,
  onCancel,
  onCreated,
}: {
  eventId: string;
  orderHint: number;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const create = useCreateTribe();
  const [form, setForm] = useState({
    name: '',
    color: '',
    motto: '',
    description: '',
    photoUrl: '',
  });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await create.mutateAsync({
        eventId,
        name: form.name.trim(),
        color: form.color.trim() || null,
        motto: form.motto.trim() || null,
        description: form.description.trim() || null,
        photoUrl: form.photoUrl.trim() || null,
        sortOrder: orderHint,
      });
      onCreated();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível criar a tribo.',
      );
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border bg-card p-5 space-y-4"
    >
      <h2 className="font-serif text-lg">Nova tribo</h2>
      <label className="block">
        <span className="text-sm font-medium">Nome</span>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          className={`mt-1 ${inputClass}`}
          placeholder="Tribo do Cedro"
          required
          autoFocus
        />
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Cor</span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            CSS válido (ex: <code>#3D5A40</code> ou{' '}
            <code>oklch(0.5 0.1 145)</code>)
          </span>
          <input
            type="text"
            value={form.color}
            onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))}
            className={`mt-1 ${inputClass} font-mono`}
            placeholder="#3D5A40"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Lema</span>
          <input
            type="text"
            value={form.motto}
            onChange={(e) => setForm((s) => ({ ...s, motto: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="Raízes profundas"
          />
        </label>
      </div>
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
      <label className="block">
        <span className="text-sm font-medium">URL da foto</span>
        <input
          type="url"
          value={form.photoUrl}
          onChange={(e) => setForm((s) => ({ ...s, photoUrl: e.target.value }))}
          className={`mt-1 ${inputClass}`}
          placeholder="https://..."
        />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={create.isPending || form.name.trim().length < 2}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {create.isPending ? 'Criando…' : 'Criar tribo'}
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

function TribeCard({
  tribe,
  eventId,
}: {
  tribe: TribeWithMembers;
  eventId: string;
}) {
  const update = useUpdateTribe(eventId);
  const remove = useDeleteTribe(eventId);
  const removeMember = useRemoveTribeMember(eventId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: tribe.name,
    color: tribe.color ?? '',
    motto: tribe.motto ?? '',
    description: tribe.description ?? '',
    photoUrl: tribe.photoUrl ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await update.mutateAsync({
        id: tribe.id,
        input: {
          name: form.name.trim(),
          color: form.color.trim() || null,
          motto: form.motto.trim() || null,
          description: form.description.trim() || null,
          photoUrl: form.photoUrl.trim() || null,
        },
      });
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível salvar.',
      );
    }
  };

  const onRemove = async () => {
    setError(null);
    try {
      await remove.mutateAsync(tribe.id);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível excluir.',
      );
    }
  };

  const onRemoveMember = async (personId: string) => {
    if (!confirm('Remover esta pessoa da tribo?')) return;
    try {
      await removeMember.mutateAsync({ tribeId: tribe.id, personId });
    } catch (err) {
      alert(
        err instanceof ApiError ? err.message : 'Não foi possível remover.',
      );
    }
  };

  const lider = tribe.members.find((m) => m.role === 'lider');
  const vice = tribe.members.find((m) => m.role === 'vice_lider');
  const campistas = tribe.members.filter((m) => m.role === 'campista');

  if (editing) {
    return (
      <form
        onSubmit={onSave}
        className="rounded-lg border bg-card p-5 space-y-4"
      >
        <h2 className="font-serif text-lg">Editar tribo</h2>
        <label className="block">
          <span className="text-sm font-medium">Nome</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            required
          />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Cor</span>
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))}
              className={`mt-1 ${inputClass} font-mono`}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Lema</span>
            <input
              type="text"
              value={form.motto}
              onChange={(e) => setForm((s) => ({ ...s, motto: e.target.value }))}
              className={`mt-1 ${inputClass}`}
            />
          </label>
        </div>
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
        <label className="block">
          <span className="text-sm font-medium">URL da foto</span>
          <input
            type="url"
            value={form.photoUrl}
            onChange={(e) => setForm((s) => ({ ...s, photoUrl: e.target.value }))}
            className={`mt-1 ${inputClass}`}
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={update.isPending}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {update.isPending ? 'Salvando…' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError(null);
            }}
            className="text-sm text-muted-foreground underline"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            {tribe.color && (
              <span
                aria-hidden
                className="size-4 rounded-full border"
                style={{ backgroundColor: tribe.color }}
              />
            )}
            <h2 className="font-serif text-xl tracking-tight">{tribe.name}</h2>
          </div>
          {tribe.motto && (
            <p className="text-sm italic text-muted-foreground mt-1">
              "{tribe.motto}"
            </p>
          )}
          {tribe.description && (
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              {tribe.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
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
                onClick={onRemove}
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
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-2">
        {tribe.members.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem membros ainda.</p>
        ) : (
          <ul className="space-y-1.5">
            {[lider, vice, ...campistas]
              .filter((m): m is NonNullable<typeof lider> => !!m)
              .map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">
                      {m.person.fullName}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {roleLabel[m.role]}
                      {!m.isRevealedToMember && ' · não revelado'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveMember(m.person.id)}
                    className="text-xs text-muted-foreground hover:text-destructive underline"
                  >
                    Remover
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      <AddMemberPicker
        eventId={eventId}
        tribe={tribe}
        existingPersonIds={new Set(tribe.members.map((m) => m.person.id))}
      />
    </div>
  );
}

function AddMemberPicker({
  eventId,
  tribe,
  existingPersonIds,
}: {
  eventId: string;
  tribe: TribeWithMembers;
  existingPersonIds: Set<string>;
}) {
  const { data: registrations } = useEventRegistrations(eventId);
  const addMember = useAddTribeMember(eventId);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<TribeMemberRole>('campista');
  const [error, setError] = useState<string | null>(null);

  const candidates = useMemo(() => {
    if (!registrations) return [];
    const q = search.trim().toLowerCase();
    return registrations
      .filter((r) => !existingPersonIds.has(r.person.id))
      .filter(
        (r) => r.status === 'aprovada' || r.status === 'confirmada',
      )
      .filter((r) =>
        q ? r.person.fullName.toLowerCase().includes(q) : true,
      )
      .slice(0, 8);
  }, [registrations, existingPersonIds, search]);

  const onAdd = async (personId: string) => {
    setError(null);
    try {
      await addMember.mutateAsync({
        tribeId: tribe.id,
        input: { personId, role },
      });
      setSearch('');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível adicionar.',
      );
    }
  };

  return (
    <div className="rounded-md border border-dashed bg-secondary/20 p-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar inscrito aprovado/confirmado…"
          className="flex-1 min-w-[200px] rounded-md border bg-background px-2 py-1 text-xs"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as TribeMemberRole)}
          className="rounded-md border bg-background px-2 py-1 text-xs"
        >
          <option value="campista">Campista</option>
          <option value="vice_lider">Vice-líder</option>
          <option value="lider">Líder</option>
        </select>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {candidates.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">
          {registrations && registrations.length === 0
            ? 'Sem inscrições no evento ainda.'
            : 'Nenhum inscrito disponível para adicionar.'}
        </p>
      ) : (
        <ul className="space-y-1">
          {candidates.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between text-xs"
            >
              <span>{r.person.fullName}</span>
              <button
                type="button"
                onClick={() => onAdd(r.person.id)}
                disabled={addMember.isPending}
                className="rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-xs disabled:opacity-50"
              >
                + Adicionar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
