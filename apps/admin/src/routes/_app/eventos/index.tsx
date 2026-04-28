import { Badge, type Tone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { TBody, TD, TH, THead, TR, Table } from '@/components/ui/Table';
import { Toolbar, ToolbarSearch } from '@/components/ui/Toolbar';
import { formatDateRange } from '@/lib/format';
import { type AdminEvent, type EventStatus, useAdminEvents } from '@/lib/queries/events';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/_app/eventos/')({
  component: EventosIndex,
});

const typeLabel: Record<AdminEvent['type'], string> = {
  acampamento: 'Acampamento',
  retiro: 'Retiro',
  encontro: 'Encontro',
  formacao: 'Formação',
  outro: 'Evento',
};

const statusInfo: Record<EventStatus, { label: string; tone: Tone }> = {
  rascunho: { label: 'Rascunho', tone: 'neutral' },
  inscricoes_abertas: { label: 'Inscrições abertas', tone: 'success' },
  inscricoes_fechadas: { label: 'Inscrições fechadas', tone: 'warning' },
  em_andamento: { label: 'Acontecendo agora', tone: 'info' },
  finalizado: { label: 'Finalizado', tone: 'neutral' },
  cancelado: { label: 'Cancelado', tone: 'danger' },
};

function EventosIndex() {
  const { data: events, isLoading, isError } = useAdminEvents();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>('all');

  const filtered = useMemo(() => {
    if (!events) return [];
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (q && !e.name.toLowerCase().includes(q) && !e.location?.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [events, search, statusFilter]);

  return (
    <div className="px-8 py-8 max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Eventos"
        description="Acampamentos, retiros, encontros e formações da comunidade. Crie eventos novos ou ajuste os existentes."
        actions={
          <Button asChild>
            <Link to="/eventos/novo">
              <svg viewBox="0 0 12 12" fill="none" aria-hidden className="size-3">
                <path
                  d="M6 1.5V10.5M1.5 6H10.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
              Novo evento
            </Link>
          </Button>
        }
      />

      <Toolbar>
        <ToolbarSearch
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou local…"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | EventStatus)}
          className="w-56"
        >
          <option value="all">Todos os status</option>
          {(Object.keys(statusInfo) as EventStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusInfo[s].label}
            </option>
          ))}
        </Select>
      </Toolbar>

      {isLoading && <p className="text-sm text-(color:--color-muted-foreground)">Carregando…</p>}

      {isError && (
        <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) px-4 py-3 text-sm text-(color:--color-danger)">
          Não conseguimos buscar os eventos. Tente recarregar.
        </div>
      )}

      {events && filtered.length === 0 && (
        <EmptyState
          icon={
            <svg viewBox="0 0 36 36" fill="none" className="size-9" aria-hidden>
              <rect
                x="5"
                y="9"
                width="26"
                height="22"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M5 15H31M12 5V11M24 5V11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          }
          title={
            events.length === 0 ? 'Nenhum evento ainda' : 'Nenhum evento corresponde ao filtro'
          }
          description={
            events.length === 0
              ? 'Quando você criar o primeiro evento, ele aparece aqui — e também no app dos campistas, se as inscrições estiverem abertas.'
              : 'Ajuste a busca ou o filtro de status pra ver mais.'
          }
          action={
            events.length === 0 ? (
              <Button asChild>
                <Link to="/eventos/novo">Criar primeiro evento</Link>
              </Button>
            ) : null
          }
        />
      )}

      {filtered.length > 0 && (
        <Table>
          <THead>
            <tr>
              <TH>Evento</TH>
              <TH>Datas</TH>
              <TH>Status</TH>
              <TH align="right">Inscrições</TH>
            </tr>
          </THead>
          <TBody>
            {filtered.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </TBody>
        </Table>
      )}

      <p className="text-[11px] text-(color:--color-muted-foreground)">
        {filtered.length} evento{filtered.length === 1 ? '' : 's'}
        {events && filtered.length !== events.length && ` de ${events.length}`}.
      </p>
    </div>
  );
}

function EventRow({ event }: { event: AdminEvent }) {
  const status = statusInfo[event.status];
  return (
    <TR>
      <TD>
        <Link to="/eventos/$id" params={{ id: event.id }} className="block group">
          <p className="font-medium leading-tight group-hover:text-(color:--color-primary) transition-colors">
            {event.name}
          </p>
          <p className="text-[11px] text-(color:--color-muted-foreground) mt-0.5">
            {typeLabel[event.type]}
            {event.editionNumber ? ` · ${event.editionNumber}º` : ''}
            {event.location ? ` · ${event.location}` : ''}
          </p>
        </Link>
      </TD>
      <TD className="text-(color:--color-muted-foreground) whitespace-nowrap">
        {formatDateRange(event.startDate, event.endDate)}
      </TD>
      <TD>
        <Badge tone={status.tone} dot>
          {status.label}
        </Badge>
      </TD>
      <TD align="right" className="whitespace-nowrap">
        <span className="font-mono tabular-nums">{event.registrationCount}</span>
        {event.pendingCount > 0 && (
          <span className="ml-2 text-[11px] text-(color:--color-warning)">
            {event.pendingCount} pendentes
          </span>
        )}
      </TD>
    </TR>
  );
}
