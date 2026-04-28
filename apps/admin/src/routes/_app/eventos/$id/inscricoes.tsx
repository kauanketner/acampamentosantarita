import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import {
  PaymentBadge,
  StatusBadge,
} from '@/components/registrations/StatusBadge';
import { RegistrationActions } from '@/components/registrations/RegistrationActions';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { Toolbar, ToolbarSearch } from '@/components/ui/Toolbar';
import { Table, THead, TH, TBody, TR, TD } from '@/components/ui/Table';
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
    <div className="px-8 py-8 max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Evento · Inscrições"
        backTo={{ label: event?.name ?? 'Evento', to: '/eventos/$id', params: { id } }}
        title="Inscrições"
        description={
          stats.total > 0
            ? `${stats.total} ${stats.total === 1 ? 'pessoa inscrita' : 'pessoas inscritas'}${stats.pendente > 0 ? ` · ${stats.pendente} aguardando aprovação` : ''}.`
            : 'Sem inscrições ainda neste evento.'
        }
      />

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat
          label="Pendentes"
          value={stats.pendente}
          tone={stats.pendente > 0 ? 'warning' : 'neutral'}
        />
        <Stat label="Aprovadas" value={stats.aprovada} tone="info" />
        <Stat label="Confirmadas" value={stats.confirmada} tone="success" />
        <Stat label="Recusadas" value={stats.cancelada} tone="neutral" />
      </section>

      <Toolbar>
        <ToolbarSearch
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome…"
        />
        <Select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value as 'all' | 'campista' | 'equipista')
          }
          className="w-44"
        >
          {ROLE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'all' | RegistrationStatus)
          }
          className="w-48"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </Toolbar>

      {isLoading && (
        <p className="text-sm text-(color:--color-muted-foreground)">
          Carregando…
        </p>
      )}

      {isError && (
        <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) px-4 py-3 text-sm text-(color:--color-danger)">
          Não conseguimos buscar as inscrições.
        </div>
      )}

      {registrations && filtered.length === 0 && (
        <EmptyState
          icon={
            <svg viewBox="0 0 36 36" fill="none" className="size-9" aria-hidden>
              <rect
                x="6"
                y="8"
                width="24"
                height="22"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M11 14H25M11 18H21M11 22H18"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          }
          title={
            registrations.length === 0
              ? 'Sem inscrições ainda'
              : 'Nenhuma inscrição corresponde ao filtro'
          }
          description={
            registrations.length === 0
              ? 'Quando alguém se inscrever pelo app, aparece aqui na hora.'
              : 'Tente limpar o filtro ou buscar por outro nome.'
          }
        />
      )}

      {filtered.length > 0 && (
        <Table>
          <THead>
            <tr>
              <TH>Pessoa</TH>
              <TH>Papel</TH>
              <TH>Status</TH>
              <TH align="right">Ações</TH>
            </tr>
          </THead>
          <TBody>
            {filtered.map((r) => (
              <RegistrationRow key={r.id} reg={r} />
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}

function RegistrationRow({ reg }: { reg: EventRegistration }) {
  return (
    <TR>
      <TD>
        <p className="font-medium leading-tight">{reg.person.fullName}</p>
        <p className="text-[11px] text-(color:--color-muted-foreground) mt-0.5 font-mono tabular-nums">
          {reg.person.mobilePhone
            ? maskPhoneDisplay(reg.person.mobilePhone)
            : '—'}
          {reg.person.city && (
            <span className="font-sans"> · {reg.person.city}</span>
          )}
          {reg.person.state && (
            <span className="font-sans text-(color:--color-subtle)">
              /{reg.person.state}
            </span>
          )}
        </p>
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-(color:--color-subtle) mt-1">
          Inscrita em{' '}
          {new Date(reg.registeredAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
        {reg.cancellationReason && (
          <p className="text-[11px] text-(color:--color-danger) mt-1 max-w-xs">
            Motivo: {reg.cancellationReason}
          </p>
        )}
      </TD>
      <TD>
        <p className="text-sm capitalize">{reg.roleIntent}</p>
        {reg.priceAmount && (
          <p className="text-[11px] text-(color:--color-muted-foreground) mt-0.5 font-mono tabular-nums">
            {brl(Number(reg.priceAmount))}
          </p>
        )}
      </TD>
      <TD>
        <div className="space-y-1">
          <StatusBadge status={reg.status} />
          <div>
            <PaymentBadge status={reg.paymentStatus} />
          </div>
        </div>
      </TD>
      <TD align="right">
        <RegistrationActions registration={reg} />
      </TD>
    </TR>
  );
}
