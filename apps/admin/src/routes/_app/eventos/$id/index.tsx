import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { CustomQuestionsManager } from '@/components/forms/CustomQuestionsManager';
import { EventForm } from '@/components/forms/EventForm';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ApiError } from '@/lib/api';
import { brl, formatDateRange } from '@/lib/format';
import {
  useAdminEvent,
  useAdminEvents,
  useDeleteEvent,
  useUpdateEvent,
} from '@/lib/queries/events';

export const Route = createFileRoute('/_app/eventos/$id/')({
  component: EventoVisaoGeral,
});

function EventoVisaoGeral() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, isError } = useAdminEvent(id);
  const { data: events } = useAdminEvents();
  const update = useUpdateEvent(id);
  const remove = useDeleteEvent();
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const adminRow = events?.find((e) => e.id === id);

  if (isLoading) {
    return (
      <div className="px-8 py-8 text-sm text-(color:--color-muted-foreground)">
        Carregando…
      </div>
    );
  }
  if (isError || !event) {
    return (
      <div className="px-8 py-8 max-w-3xl space-y-3">
        <p
          className="font-display text-3xl tracking-tight"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Evento não encontrado.
        </p>
        <Link
          to="/eventos"
          className="inline-block text-sm text-(color:--color-primary) underline underline-offset-2"
        >
          ← Voltar pra lista
        </Link>
      </div>
    );
  }

  const onDelete = async () => {
    try {
      await remove.mutateAsync(id);
      navigate({ to: '/eventos' });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível excluir.',
      );
    }
  };

  return (
    <div className="px-8 py-8 max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Evento"
        backTo={{ label: 'Eventos', to: '/eventos' }}
        title={event.name}
        description={`${formatDateRange(event.startDate, event.endDate)}${
          event.location ? ` · ${event.location}` : ''
        }`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/eventos/$id/inscricoes" params={{ id }}>
                Inscrições →
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/eventos/$id/tribos" params={{ id }}>
                Tribos →
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/eventos/$id/equipes" params={{ id }}>
                Equipes →
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/eventos/$id/relatorios" params={{ id }}>
                Relatórios →
              </Link>
            </Button>
          </div>
        }
      />

      {adminRow && (
        <Card>
          <CardBody className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Mini label="Inscrições" value={adminRow.registrationCount} />
            <Mini
              label="Aprovados"
              value={adminRow.approvedCount}
              tone="success"
            />
            <Mini
              label="Pendentes"
              value={adminRow.pendingCount}
              tone={adminRow.pendingCount > 0 ? 'warning' : 'neutral'}
            />
            <Mini
              label="Vagas"
              value={adminRow.maxParticipants ?? '∞'}
            />
          </CardBody>
        </Card>
      )}

      {savedAt && (
        <div className="rounded-(--radius-md) border border-(color:--color-success)/40 bg-(color:--color-success-soft) px-4 py-3 text-sm text-(color:--color-success-foreground) flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
            <path
              d="M5 10.5L8.5 14L15 7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            Salvo. As mudanças aparecem no app dos campistas no próximo refresh.
          </span>
        </div>
      )}

      <Card>
        <CardBody>
          <SectionHeader
            eyebrow="Configuração"
            title="Detalhes do evento"
            description="Datas, valores, capacidade e textos públicos."
          />
          <div className="mt-5">
            <EventForm
              initial={event}
              submitLabel="Salvar alterações"
              submitting={update.isPending}
              errorMessage={error}
              onSubmit={async (input) => {
                setError(null);
                try {
                  await update.mutateAsync(input);
                  setSavedAt(Date.now());
                  setTimeout(() => setSavedAt(null), 3000);
                } catch (err) {
                  setError(
                    err instanceof ApiError
                      ? err.message
                      : 'Não foi possível salvar.',
                  );
                }
              }}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <SectionHeader
            eyebrow="Formulário"
            title="Perguntas customizadas"
            description="Perguntas que aparecem no formulário de inscrição. Você define se elas aparecem para campistas, equipistas ou ambos."
          />
          <div className="mt-5">
            <CustomQuestionsManager eventId={id} />
          </div>
        </CardBody>
      </Card>

      {(event.priceCampista || event.priceEquipista) && (
        <Card variant="soft">
          <CardBody>
            <SectionHeader
              eyebrow="Financeiro"
              title="Resumo de valores"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {event.priceCampista && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                    Campista
                  </p>
                  <p
                    className="font-display text-2xl tabular-nums tracking-tight mt-1"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
                  >
                    {brl(Number(event.priceCampista))}
                  </p>
                </div>
              )}
              {event.priceEquipista && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                    Equipista
                  </p>
                  <p
                    className="font-display text-2xl tabular-nums tracking-tight mt-1"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
                  >
                    {brl(Number(event.priceEquipista))}
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="rounded-(--radius-lg) border border-(color:--color-danger)/30 bg-(color:--color-danger-soft) p-5 space-y-3">
        <SectionHeader
          eyebrow="⚠ Zona perigosa"
          title="Excluir este evento"
          description="Esconde o evento do app e do site. As inscrições já feitas continuam armazenadas, mas o evento some das listas."
          tone="danger"
        />
        {!confirmingDelete ? (
          <Button
            variant="danger-ghost"
            size="sm"
            onClick={() => setConfirmingDelete(true)}
          >
            Excluir evento
          </Button>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              disabled={remove.isPending}
            >
              {remove.isPending ? 'Excluindo…' : 'Confirmar exclusão'}
            </Button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="text-xs text-(color:--color-muted-foreground) hover:text-(color:--color-foreground) underline underline-offset-2"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  tone,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: 'default' | 'danger';
}) {
  const isDanger = tone === 'danger';
  return (
    <div className="space-y-1.5">
      <p
        className={
          'text-[10px] font-mono uppercase tracking-[0.18em] ' +
          (isDanger
            ? 'text-(color:--color-danger)'
            : 'text-(color:--color-muted-foreground)')
        }
      >
        {eyebrow}
      </p>
      <h2
        className={
          'font-display text-xl leading-tight tracking-tight ' +
          (isDanger ? 'text-(color:--color-danger)' : '')
        }
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function Mini({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning';
}) {
  const toneClass =
    tone === 'success'
      ? 'text-(color:--color-success-foreground)'
      : tone === 'warning'
        ? 'text-(color:--color-warning)'
        : '';
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
        {label}
      </p>
      <p
        className={`font-display text-2xl tabular-nums tracking-tight mt-1 ${toneClass}`}
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
      >
        {value}
      </p>
    </div>
  );
}

