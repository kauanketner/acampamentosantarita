import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/lib/api';
import {
  type EventRegistration,
  useAdminCancelRegistration,
  useApproveRegistration,
  useMarkAttended,
  useRejectRegistration,
} from '@/lib/queries/registrations';
import { useState } from 'react';

type Props = {
  registration: EventRegistration;
};

export function RegistrationActions({ registration }: Props) {
  const approve = useApproveRegistration();
  const reject = useRejectRegistration();
  const cancel = useAdminCancelRegistration();
  const attend = useMarkAttended();

  const [confirmReject, setConfirmReject] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onApprove = async () => {
    setError(null);
    try {
      await approve.mutateAsync(registration.id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível aprovar.');
    }
  };

  const onAttend = async () => {
    setError(null);
    try {
      await attend.mutateAsync(registration.id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível marcar.');
    }
  };

  const onReject = async () => {
    setError(null);
    try {
      await reject.mutateAsync({ id: registration.id, reason: reason || undefined });
      setConfirmReject(false);
      setReason('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível rejeitar.');
    }
  };

  const onCancel = async () => {
    setError(null);
    try {
      await cancel.mutateAsync({ id: registration.id, reason: reason || undefined });
      setConfirmCancel(false);
      setReason('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível cancelar.');
    }
  };

  const isPending = approve.isPending || reject.isPending || cancel.isPending || attend.isPending;

  if (confirmReject || confirmCancel) {
    const label = confirmReject ? 'Rejeitar inscrição' : 'Cancelar inscrição';
    const action = confirmReject ? onReject : onCancel;
    return (
      <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) p-3 space-y-2 min-w-[260px]">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-(color:--color-danger)">
          {label}
        </p>
        <Input
          type="text"
          placeholder="Motivo (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="text-xs"
        />
        {error && <p className="text-xs text-(color:--color-danger)">{error}</p>}
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" onClick={action} disabled={isPending}>
            {isPending ? '…' : 'Confirmar'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setConfirmReject(false);
              setConfirmCancel(false);
              setReason('');
              setError(null);
            }}
            className="text-xs text-(color:--color-muted-foreground) hover:text-(color:--color-foreground) underline underline-offset-2"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const showApprove = registration.status === 'pendente' || registration.status === 'em_espera';
  const showAttend =
    (registration.status === 'aprovada' || registration.status === 'confirmada') &&
    !registration.attended;
  const showReject = registration.status === 'pendente' || registration.status === 'em_espera';
  const showCancel = registration.status !== 'cancelada' && registration.status !== 'rejeitada';

  return (
    <div className="flex flex-col gap-1.5 items-end">
      {error && <p className="text-xs text-(color:--color-danger)">{error}</p>}
      <div className="flex flex-wrap gap-1.5 justify-end">
        {showApprove && (
          <Button size="sm" onClick={onApprove} disabled={isPending}>
            {approve.isPending ? '…' : 'Aprovar'}
          </Button>
        )}
        {showAttend && (
          <Button variant="secondary" size="sm" onClick={onAttend} disabled={isPending}>
            {attend.isPending ? '…' : 'Marcar presença'}
          </Button>
        )}
        {showReject && (
          <Button
            variant="danger-ghost"
            size="sm"
            onClick={() => setConfirmReject(true)}
            disabled={isPending}
          >
            Rejeitar
          </Button>
        )}
        {showCancel && !showReject && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmCancel(true)}
            disabled={isPending}
          >
            Cancelar
          </Button>
        )}
      </div>
      {registration.attended && (
        <span className="text-[11px] text-(color:--color-success-foreground) inline-flex items-center gap-1">
          <svg viewBox="0 0 20 20" fill="none" className="size-3" aria-hidden>
            <path
              d="M5 10.5L8.5 14L15 7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          presença marcada
        </span>
      )}
    </div>
  );
}
