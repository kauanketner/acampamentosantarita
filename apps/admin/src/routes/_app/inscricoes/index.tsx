import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { ApiError } from '@/lib/api';
import { brl, formatDateRange, maskPhoneDisplay } from '@/lib/format';
import {
  type PendingRegistration,
  useApproveRegistration,
  usePendingRegistrations,
  useRejectRegistration,
} from '@/lib/queries/registrations';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_app/inscricoes/')({
  component: InscricoesIndex,
});

function InscricoesIndex() {
  const { data, isLoading, isError } = usePendingRegistrations();

  return (
    <div className="px-8 py-8 max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Operação · Triagem"
        title="Inscrições pendentes"
        description="Aprovações aguardando coordenação. Cuide com calma — cada nome é uma alma."
      />

      {isLoading && <p className="text-sm text-(color:--color-muted-foreground)">Carregando…</p>}

      {isError && (
        <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) px-4 py-3 text-sm text-(color:--color-danger)">
          Não conseguimos buscar.
        </div>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={
            <svg viewBox="0 0 36 36" fill="none" className="size-9" aria-hidden>
              <path
                d="M9 18.5L15.5 25L27 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          title="Tudo em dia"
          description="Sem inscrições aguardando aprovação no momento. Bom trabalho 🌿"
        />
      )}

      {data && data.length > 0 && (
        <>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
            {data.length} {data.length === 1 ? 'aguardando' : 'aguardando'}
          </p>
          <ul className="space-y-3">
            {data.map((reg) => (
              <li key={reg.id}>
                <PendingCard reg={reg} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function PendingCard({ reg }: { reg: PendingRegistration }) {
  const approve = useApproveRegistration();
  const reject = useRejectRegistration();
  const [confirmReject, setConfirmReject] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onApprove = async () => {
    setError(null);
    try {
      await approve.mutateAsync(reg.id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível aprovar.');
    }
  };

  const onReject = async () => {
    setError(null);
    try {
      await reject.mutateAsync({ id: reg.id, reason: reason || undefined });
      setConfirmReject(false);
      setReason('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível rejeitar.');
    }
  };

  return (
    <Card>
      <CardBody className="flex flex-wrap items-start gap-5">
        <div className="flex-1 min-w-[260px] space-y-1.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p
              className="font-display text-lg leading-tight tracking-tight"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
            >
              {reg.person.fullName}
            </p>
            <Badge tone={reg.roleIntent === 'campista' ? 'primary' : 'accent'} size="sm">
              {reg.roleIntent}
            </Badge>
          </div>

          <p className="text-[12px] text-(color:--color-muted-foreground) flex items-center gap-2 flex-wrap">
            <span className="font-mono tabular-nums">
              {reg.person.mobilePhone ? maskPhoneDisplay(reg.person.mobilePhone) : '—'}
            </span>
            {reg.priceAmount && (
              <>
                <span className="text-(color:--color-subtle)">·</span>
                <span className="font-mono tabular-nums text-(color:--color-foreground)">
                  {brl(Number(reg.priceAmount))}
                </span>
              </>
            )}
          </p>

          <p className="text-[12px] text-(color:--color-muted-foreground) pt-0.5">
            <Link
              to="/eventos/$id"
              params={{ id: reg.event.id }}
              className="text-(color:--color-primary) hover:underline"
            >
              {reg.event.name}
            </Link>{' '}
            <span className="text-(color:--color-subtle)">·</span>{' '}
            {formatDateRange(reg.event.startDate, reg.event.endDate)}
          </p>

          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-(color:--color-subtle) pt-1">
            Inscrita em{' '}
            {new Date(reg.registeredAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          {error && <p className="text-xs text-(color:--color-danger) mt-1.5">{error}</p>}
        </div>

        <div className="flex flex-col gap-2 items-end">
          {confirmReject ? (
            <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) p-3 space-y-2.5 min-w-[260px]">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-(color:--color-danger)">
                Rejeitar inscrição
              </p>
              <Input
                type="text"
                placeholder="Motivo (opcional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs"
              />
              <div className="flex items-center gap-2">
                <Button variant="danger" size="sm" onClick={onReject} disabled={reject.isPending}>
                  {reject.isPending ? '…' : 'Confirmar'}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmReject(false);
                    setReason('');
                    setError(null);
                  }}
                  className="text-xs text-(color:--color-muted-foreground) hover:text-(color:--color-foreground) underline underline-offset-2"
                >
                  Voltar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 justify-end">
              <Button
                size="sm"
                onClick={onApprove}
                disabled={approve.isPending || reject.isPending}
              >
                {approve.isPending ? '…' : 'Aprovar'}
              </Button>
              <Button
                variant="danger-ghost"
                size="sm"
                onClick={() => setConfirmReject(true)}
                disabled={approve.isPending || reject.isPending}
              >
                Rejeitar
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/eventos/$id/inscricoes" params={{ id: reg.event.id }}>
                  Abrir no evento →
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
