import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import {
  PaymentBadge,
  StatusBadge,
} from '@/components/registrations/StatusBadge';
import { RegistrationActions } from '@/components/registrations/RegistrationActions';
import { brl, maskPhoneDisplay } from '@/lib/format';
import { useAdminEvent } from '@/lib/queries/events';
import {
  type EventRegistration,
  type RegistrationStatus,
  useEventRegistrations,
} from '@/lib/queries/registrations';

export const Route = createFileRoute('/_app/eventos/$id/inscricoes')({
  component: EventoInscricoes,
});

const ROLE_FILTERS: Array<{ value: 'all' | 'campista' | 'equipista'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'campista', label: 'Campistas' },
  { value: 'equipista', label: 'Equipistas' },
];

const STATUS_FILTERS: Array<{ value: 'all' | RegistrationStatus; label: string }> = [
  { value: 'all', label: 'Todos status' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'aprovada', label: 'Aprovadas' },
  { value: 'confirmada', label: 'Confirmadas' },
  { value: 'em_espera', label: 'Em espera' },
  { value: 'rejeitada', label: 'Rejeitadas' },
  { value: 'cancelada', label: 'Canceladas' },
];

function EventoInscricoes() {
  const { id } = Route.useParams();
  const { data: event } = useAdminEvent(id);
  const { data: registrations, isLoading, isError } = useEventRegistrations(id);

  const [roleFilter, setRoleFilter] = useState<'all' | 'campista' | 'equipista'>(
    'all',
  );
  const [statusFilter, setStatusFilter] = useState<'all' | RegistrationStatus>(
    'all',
  );
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!registrations) return [];
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      if (roleFilter !== 'all' && r.roleIntent !== roleFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (q && !r.person.fullName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [registrations, roleFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const acc = {
      total: registrations?.length ?? 0,
      pendente: 0,
      aprovada: 0,
      confirmada: 0,
      cancelada: 0,
    };
    for (const r of registrations ?? []) {
      if (r.status === 'pendente') acc.pendente += 1;
      else if (r.status === 'aprovada') acc.aprovada += 1;
      else if (r.status === 'confirmada') acc.confirmada += 1;
      else if (r.status === 'cancelada' || r.status === 'rejeitada')
        acc.cancelada += 1;
    }
    return acc;
  }, [registrations]);

  return (
    <div className="p-6 space-y-5">
      <header className="space-y-2">
        <Link
          to="/eventos/$id"
          params={{ id }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← {event?.name ?? 'Evento'}
        </Link>
        <h1 className="font-serif text-2xl">Inscrições</h1>
        <p className="text-sm text-muted-foreground">
          {stats.total} {stats.total === 1 ? 'pessoa inscrita' : 'pessoas inscritas'}
          {stats.pendente > 0 && ` · ${stats.pendente} aguardando aprovação`}
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Pendentes" value={stats.pendente} tone="amber" />
        <Stat label="Aprovadas" value={stats.aprovada} tone="sky" />
        <Stat label="Confirmadas" value={stats.confirmada} tone="green" />
        <Stat label="Recusadas" value={stats.cancelada} tone="neutral" />
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome…"
          className="flex-1 min-w-[200px] rounded-md border bg-background px-3 py-1.5 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value as 'all' | 'campista' | 'equipista')
          }
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          {ROLE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'all' | RegistrationStatus)
          }
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      )}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar as inscrições.
        </div>
      )}

      {registrations && filtered.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">
            {registrations.length === 0
              ? 'Sem inscrições ainda'
              : 'Nenhuma inscrição corresponde ao filtro'}
          </p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            {registrations.length === 0
              ? 'Quando alguém se inscrever pelo app, aparece aqui na hora.'
              : 'Tente limpar o filtro ou buscar por outro nome.'}
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-3 font-medium">Pessoa</th>
                <th className="px-4 py-3 font-medium">Papel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <RegistrationRow key={r.id} reg={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RegistrationRow({ reg }: { reg: EventRegistration }) {
  return (
    <tr className="border-b last:border-b-0 align-top">
      <td className="px-4 py-3">
        <p className="font-medium leading-tight">{reg.person.fullName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {reg.person.mobilePhone
            ? maskPhoneDisplay(reg.person.mobilePhone)
            : '—'}
          {reg.person.city && ` · ${reg.person.city}`}
          {reg.person.state && `/${reg.person.state}`}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Inscrita em{' '}
          {new Date(reg.registeredAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
        {reg.cancellationReason && (
          <p className="text-[11px] text-destructive mt-1 max-w-xs">
            Motivo: {reg.cancellationReason}
          </p>
        )}
      </td>
      <td className="px-4 py-3">
        <p className="text-sm capitalize">{reg.roleIntent}</p>
        {reg.priceAmount && (
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
            {brl(Number(reg.priceAmount))}
          </p>
        )}
      </td>
      <td className="px-4 py-3 space-y-1">
        <StatusBadge status={reg.status} />
        <div>
          <PaymentBadge status={reg.paymentStatus} />
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <RegistrationActions registration={reg} />
      </td>
    </tr>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'amber' | 'sky' | 'green' | 'neutral';
}) {
  const ring: Record<typeof tone, string> = {
    amber: 'border-amber-300 dark:border-amber-800',
    sky: 'border-sky-300 dark:border-sky-800',
    green: 'border-emerald-300 dark:border-emerald-800',
    neutral: 'border-border',
  };
  return (
    <div className={`rounded-lg border bg-card p-4 ${ring[tone]}`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-serif text-2xl mt-1">{value}</p>
    </div>
  );
}
