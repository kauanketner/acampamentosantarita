import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ApiError } from '@/lib/api';
import { brl, formatDateRange, maskPhoneDisplay } from '@/lib/format';
import {
  type PendingRegistration,
  useApproveRegistration,
  usePendingRegistrations,
  useRejectRegistration,
} from '@/lib/queries/registrations';

export const Route = createFileRoute('/_app/inscricoes/')({
  component: InscricoesIndex,
});

function InscricoesIndex() {
  const { data, isLoading, isError } = usePendingRegistrations();

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="font-serif text-2xl">Inscrições pendentes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Triagem rápida das inscrições aguardando aprovação em todos os eventos.
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Não conseguimos buscar.
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Tudo em dia 🌿</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Sem inscrições aguardando aprovação no momento.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((reg) => (
            <PendingRow key={reg.id} reg={reg} />
          ))}
        </div>
      )}
    </div>
  );
}

function PendingRow({ reg }: { reg: PendingRegistration }) {
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
    <div className="rounded-lg border bg-card p-4 flex flex-wrap items-start gap-4">
      <div className="flex-1 min-w-[260px]">
        <p className="font-medium leading-tight">{reg.person.fullName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {reg.person.mobilePhone
            ? maskPhoneDisplay(reg.person.mobilePhone)
            : '—'}
          {' · '}
          <span className="capitalize">{reg.roleIntent}</span>
          {reg.priceAmount && (
            <>
              {' · '}
              <span className="font-mono">{brl(Number(reg.priceAmount))}</span>
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">
          <Link
            to="/eventos/$id"
            params={{ id: reg.event.id }}
            className="hover:text-foreground underline"
          >
            {reg.event.name}
          </Link>
          {' · '}
          {formatDateRange(reg.event.startDate, reg.event.endDate)}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Inscrita em{' '}
          {new Date(reg.registeredAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
        {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
      </div>

      <div className="flex flex-col gap-2 items-end">
        {confirmReject ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 space-y-2 min-w-[260px]">
            <p className="text-xs font-medium">Rejeitar inscrição</p>
            <input
              type="text"
              placeholder="Motivo (opcional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border bg-background px-2 py-1 text-xs"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReject}
                disabled={reject.isPending}
                className="rounded-md bg-destructive text-white px-2.5 py-1 text-xs font-medium disabled:opacity-50"
              >
                {reject.isPending ? '…' : 'Confirmar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmReject(false);
                  setReason('');
                  setError(null);
                }}
                className="text-xs text-muted-foreground underline"
              >
                Voltar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 justify-end">
            <button
              type="button"
              onClick={onApprove}
              disabled={approve.isPending || reject.isPending}
              className="rounded-md bg-emerald-600 text-white px-3 py-1 text-xs font-medium disabled:opacity-50 hover:bg-emerald-700"
            >
              {approve.isPending ? '…' : 'Aprovar'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReject(true)}
              disabled={approve.isPending || reject.isPending}
              className="rounded-md border border-destructive/40 text-destructive px-3 py-1 text-xs hover:bg-destructive/10"
            >
              Rejeitar
            </button>
            <Link
              to="/eventos/$id/inscricoes"
              params={{ id: reg.event.id }}
              className="rounded-md border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              Ver no evento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
