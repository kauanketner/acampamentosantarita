import { useState } from 'react';
import { ApiError } from '@/lib/api';
import {
  type EventRegistration,
  useAdminCancelRegistration,
  useApproveRegistration,
  useMarkAttended,
  useRejectRegistration,
} from '@/lib/queries/registrations';

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

  const isPending =
    approve.isPending ||
    reject.isPending ||
    cancel.isPending ||
    attend.isPending;

  if (confirmReject || confirmCancel) {
    const label = confirmReject ? 'Rejeitar inscrição' : 'Cancelar inscrição';
    const action = confirmReject ? onReject : onCancel;
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 space-y-2 min-w-[260px]">
        <p className="text-sm font-medium">{label}</p>
        <input
          type="text"
          placeholder="Motivo (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-md border bg-background px-2 py-1 text-xs"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={action}
            disabled={isPending}
            className="rounded-md bg-destructive text-white px-3 py-1 text-xs font-medium disabled:opacity-50"
          >
            {isPending ? '…' : 'Confirmar'}
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmReject(false);
              setConfirmCancel(false);
              setReason('');
              setError(null);
            }}
            className="text-xs text-muted-foreground underline"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const showApprove =
    registration.status === 'pendente' || registration.status === 'em_espera';
  const showAttend =
    (registration.status === 'aprovada' || registration.status === 'confirmada') &&
    !registration.attended;
  const showReject =
    registration.status === 'pendente' || registration.status === 'em_espera';
  const showCancel =
    registration.status !== 'cancelada' &&
    registration.status !== 'rejeitada';

  return (
    <div className="flex flex-col gap-1.5 items-end">
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-1.5 justify-end">
        {showApprove && (
          <button
            type="button"
            onClick={onApprove}
            disabled={isPending}
            className="rounded-md bg-emerald-600 text-white px-2.5 py-1 text-xs font-medium disabled:opacity-50 hover:bg-emerald-700"
          >
            {approve.isPending ? '…' : 'Aprovar'}
          </button>
        )}
        {showAttend && (
          <button
            type="button"
            onClick={onAttend}
            disabled={isPending}
            className="rounded-md bg-sky-600 text-white px-2.5 py-1 text-xs font-medium disabled:opacity-50 hover:bg-sky-700"
          >
            {attend.isPending ? '…' : 'Marcar presença'}
          </button>
        )}
        {showReject && (
          <button
            type="button"
            onClick={() => setConfirmReject(true)}
            disabled={isPending}
            className="rounded-md border border-destructive/40 text-destructive px-2.5 py-1 text-xs hover:bg-destructive/10"
          >
            Rejeitar
          </button>
        )}
        {showCancel && !showReject && (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            disabled={isPending}
            className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
      {registration.attended && (
        <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
          ✓ presença marcada
        </span>
      )}
    </div>
  );
}
