import { ApiError } from '@/lib/api';
import { useAdminEvent } from '@/lib/queries/events';
import { useEventRegistrations } from '@/lib/queries/registrations';
import {
  type ServiceTeamWithMembers,
  useAddTeamAssignment,
  useEventServiceTeams,
  useRemoveTeamAssignment,
} from '@/lib/queries/service-teams';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_app/eventos/$id/equipes')({
  component: EventoEquipes,
});

function EventoEquipes() {
  const { id } = Route.useParams();
  const { data: event } = useAdminEvent(id);
  const { data: teams, isLoading } = useEventServiceTeams(id);

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
        <h1 className="font-serif text-2xl">Equipes de Serviço</h1>
        <p className="text-sm text-muted-foreground">
          Aloca equipistas inscritos do evento em cada equipe. Cadastra equipes novas em{' '}
          <Link to="/equipes-servico" className="text-primary underline">
            Equipes de Serviço
          </Link>
          .
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {teams && teams.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Nenhuma equipe cadastrada</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Cadastre equipes em{' '}
            <Link to="/equipes-servico" className="text-primary underline">
              Equipes de Serviço
            </Link>{' '}
            antes de alocar.
          </p>
        </div>
      )}

      {teams && teams.length > 0 && (
        <div className="space-y-4">
          {teams.map((t) => (
            <TeamCard key={t.id} eventId={id} team={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({
  eventId,
  team,
}: {
  eventId: string;
  team: ServiceTeamWithMembers;
}) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {team.color && (
            <span
              aria-hidden
              className="size-3 rounded-full border"
              style={{ backgroundColor: team.color }}
            />
          )}
          <h2 className="font-serif text-lg">{team.name}</h2>
          <span className="text-xs text-muted-foreground">
            {team.members.length} membro{team.members.length === 1 ? '' : 's'}
          </span>
        </div>
      </header>

      {team.members.length > 0 ? (
        <ul className="space-y-1.5">
          {team.members.map((m) => (
            <MemberRow key={m.id} eventId={eventId} teamId={team.id} member={m} />
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">Sem membros nesta equipe.</p>
      )}

      <AssignmentPicker
        eventId={eventId}
        teamId={team.id}
        existingPersonIds={new Set(team.members.map((m) => m.person.id))}
      />
    </section>
  );
}

function MemberRow({
  eventId,
  teamId,
  member,
}: {
  eventId: string;
  teamId: string;
  member: ServiceTeamWithMembers['members'][number];
}) {
  const remove = useRemoveTeamAssignment();
  return (
    <li className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="font-medium">{member.person.fullName}</p>
        <p className="text-[11px] text-muted-foreground">
          {member.functionRole}
          {member.confirmed ? ' · confirmado' : ''}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (!confirm('Remover esta pessoa da equipe?')) return;
          remove.mutate({
            teamId,
            eventId,
            personId: member.person.id,
          });
        }}
        className="text-xs text-muted-foreground hover:text-destructive underline"
      >
        Remover
      </button>
    </li>
  );
}

function AssignmentPicker({
  eventId,
  teamId,
  existingPersonIds,
}: {
  eventId: string;
  teamId: string;
  existingPersonIds: Set<string>;
}) {
  const { data: registrations } = useEventRegistrations(eventId);
  const add = useAddTeamAssignment();
  const [search, setSearch] = useState('');
  const [functionRole, setFunctionRole] = useState('membro');
  const [error, setError] = useState<string | null>(null);

  const candidates = (registrations ?? [])
    .filter((r) => !existingPersonIds.has(r.person.id) && r.roleIntent === 'equipista')
    .filter((r) => r.status === 'aprovada' || r.status === 'confirmada')
    .filter((r) =>
      search.trim() ? r.person.fullName.toLowerCase().includes(search.trim().toLowerCase()) : true,
    )
    .slice(0, 8);

  const onAdd = async (personId: string) => {
    setError(null);
    try {
      await add.mutateAsync({
        teamId,
        input: {
          eventId,
          personId,
          functionRole,
        },
      });
      setSearch('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível adicionar.');
    }
  };

  return (
    <div className="rounded-md border border-dashed bg-secondary/20 p-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar equipista aprovado…"
          className="flex-1 min-w-[200px] rounded-md border bg-background px-2 py-1 text-xs"
        />
        <select
          value={functionRole}
          onChange={(e) => setFunctionRole(e.target.value)}
          className="rounded-md border bg-background px-2 py-1 text-xs"
        >
          <option value="membro">Membro</option>
          <option value="vice">Vice-coordenador</option>
          <option value="coordenador">Coordenador</option>
        </select>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {candidates.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">
          {(registrations?.length ?? 0) === 0
            ? 'Sem inscrições no evento.'
            : 'Nenhum equipista disponível.'}
        </p>
      ) : (
        <ul className="space-y-1">
          {candidates.map((r) => (
            <li key={r.id} className="flex items-center justify-between text-xs">
              <span>{r.person.fullName}</span>
              <button
                type="button"
                onClick={() => onAdd(r.person.id)}
                disabled={add.isPending}
                className="rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-xs disabled:opacity-50"
              >
                + Alocar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
