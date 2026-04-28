import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ApiError } from '@/lib/api';
import {
  type ServiceTeam,
  type ServiceTeamInput,
  useCreateServiceTeam,
  useDeleteServiceTeam,
  useServiceTeams,
  useUpdateServiceTeam,
} from '@/lib/queries/service-teams';

export const Route = createFileRoute('/_app/equipes-servico/')({
  component: EquipesServicoIndex,
});

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function EquipesServicoIndex() {
  const { data, isLoading } = useServiceTeams();
  const [creating, setCreating] = useState(false);

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl">Equipes de Serviço</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Catálogo das equipes (Cozinha, Bem-estar, Mídia…). Alocações por
            evento ficam em <span className="text-foreground">Eventos → Equipes</span>.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Nova equipe
          </button>
        )}
      </header>

      {creating && (
        <TeamForm
          mode="create"
          onCancel={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && !creating && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhuma equipe ainda</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Crie a primeira equipe pra começar a alocar pessoas em eventos.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((t) => (
            <TeamRow key={t.id} team={t} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TeamRow({ team }: { team: ServiceTeam }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = useDeleteServiceTeam();
  const [error, setError] = useState<string | null>(null);

  if (editing) {
    return (
      <li>
        <TeamForm
          mode="edit"
          team={team}
          onCancel={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      </li>
    );
  }

  const onDelete = async () => {
    setError(null);
    try {
      await remove.mutateAsync(team.id);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível excluir.',
      );
    }
  };

  return (
    <li className="rounded-lg border bg-card p-4 flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {team.color && (
            <span
              aria-hidden
              className="size-3 rounded-full border"
              style={{ backgroundColor: team.color }}
            />
          )}
          <p className="font-medium leading-tight">{team.name}</p>
        </div>
        {team.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {team.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
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
      {error && <p className="text-xs text-destructive">{error}</p>}
    </li>
  );
}

function TeamForm({
  mode,
  team,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit';
  team?: ServiceTeam;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const create = useCreateServiceTeam();
  const update = useUpdateServiceTeam();

  const [form, setForm] = useState({
    name: team?.name ?? '',
    description: team?.description ?? '',
    color: team?.color ?? '',
    icon: team?.icon ?? '',
  });
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: ServiceTeamInput = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      color: form.color.trim() || null,
      icon: form.icon.trim() || null,
    };
    try {
      if (mode === 'create') {
        await create.mutateAsync(payload);
      } else if (team) {
        await update.mutateAsync({ id: team.id, input: payload });
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível salvar.',
      );
    }
  };

  const canSubmit = form.name.trim().length >= 2 && !isPending;

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="font-serif text-lg">
        {mode === 'create' ? 'Nova equipe' : 'Editar equipe'}
      </h2>
      <label className="block">
        <span className="text-sm font-medium">Nome</span>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          className={`mt-1 ${inputClass}`}
          placeholder="Cozinha"
          required
          autoFocus
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Descrição</span>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((s) => ({ ...s, description: e.target.value }))
          }
          rows={2}
          className={`mt-1 ${inputClass}`}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Cor</span>
          <input
            type="text"
            value={form.color}
            onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))}
            className={`mt-1 ${inputClass} font-mono`}
            placeholder="#3D5A40"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Ícone (opcional)</span>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))}
            className={`mt-1 ${inputClass}`}
            placeholder="utensils"
          />
        </label>
      </div>
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
