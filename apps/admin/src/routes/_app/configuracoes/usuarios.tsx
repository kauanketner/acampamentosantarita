import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { ApiError } from '@/lib/api';
import { maskPhoneDisplay } from '@/lib/format';
import {
  type AdminPersonRow,
  type AdminRole,
  useAdminPersons,
  useUpdatePersonRole,
} from '@/lib/queries/persons';

export const Route = createFileRoute('/_app/configuracoes/usuarios')({
  component: ConfiguracoesUsuarios,
});

const roleLabel: Record<AdminRole, string> = {
  admin: 'Administrador',
  equipe_acampamento: 'Equipe de acampamento',
  tesouraria: 'Tesouraria',
  comunicacao: 'Comunicação',
  participante: 'Participante',
};

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function ConfiguracoesUsuarios() {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading } = useAdminPersons(
    search.length >= 2 ? search : undefined,
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    return showAll
      ? data.filter((p) => p.user)
      : data.filter((p) => p.user && p.user.role !== 'participante');
  }, [data, showAll]);

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Usuários</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pessoas com acesso ao painel administrativo. Cada pessoa cadastrada no
          app pode receber uma função.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome (mín. 2 letras)…"
          className={`flex-1 min-w-[260px] ${inputClass}`}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
          Mostrar participantes (sem acesso admin)
        </label>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && filtered.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">
            {search.length >= 2
              ? 'Nenhum usuário encontrado'
              : 'Nenhum usuário com acesso admin'}
          </p>
          <p className="text-sm text-muted-foreground mt-1.5">
            {search.length < 2
              ? 'Busque acima ou marque "Mostrar participantes" pra promover alguém.'
              : 'Tente outro termo de busca.'}
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-2 font-medium">Pessoa</th>
                <th className="px-4 py-2 font-medium">Contato</th>
                <th className="px-4 py-2 font-medium">Função</th>
                <th className="px-4 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <UserRow key={p.id} person={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UserRow({ person }: { person: AdminPersonRow }) {
  const update = useUpdatePersonRole();
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState<AdminRole>(
    person.user?.role ?? 'participante',
  );
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setError(null);
    try {
      await update.mutateAsync({ personId: person.id, role });
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível salvar.',
      );
    }
  };

  return (
    <tr className="border-b last:border-b-0 hover:bg-secondary/30">
      <td className="px-4 py-2">
        <p className="font-medium leading-tight">{person.fullName}</p>
        {person.user?.email && (
          <p className="text-[11px] text-muted-foreground">
            {person.user.email}
          </p>
        )}
      </td>
      <td className="px-4 py-2 text-xs text-muted-foreground">
        {person.mobilePhone ? maskPhoneDisplay(person.mobilePhone) : '—'}
      </td>
      <td className="px-4 py-2">
        {editing ? (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="rounded-md border bg-background px-2 py-1 text-xs"
          >
            {(Object.keys(roleLabel) as AdminRole[]).map((r) => (
              <option key={r} value={r}>
                {roleLabel[r]}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm">
            {person.user ? roleLabel[person.user.role] : '—'}
          </span>
        )}
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </td>
      <td className="px-4 py-2 text-right whitespace-nowrap">
        {editing ? (
          <span className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={update.isPending}
              className="rounded-md bg-primary text-primary-foreground px-3 py-0.5 text-xs disabled:opacity-50"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setRole(person.user?.role ?? 'participante');
              }}
              className="text-xs text-muted-foreground underline"
            >
              Cancelar
            </button>
          </span>
        ) : person.user ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-primary underline"
          >
            Alterar
          </button>
        ) : (
          <span className="text-[10px] text-muted-foreground">sem login</span>
        )}
      </td>
    </tr>
  );
}
