import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Calendar, Loader2, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ApiError } from '@/lib/api';
import { brl, formatDateRange } from '@/lib/format';
import {
  type RegistrationDetail,
  type RegistrationPaymentStatus,
  type RegistrationStatus,
  useCancelRegistration,
  useRegistration,
} from '@/lib/queries/registrations';

export const Route = createFileRoute('/_auth/minhas-inscricoes/$id')({
  component: InscricaoDetalhe,
});

const statusInfo: Record<
  RegistrationStatus,
  { label: string; tone: 'primary' | 'neutral' | 'warning' | 'success' | 'danger' }
> = {
  pendente: { label: 'aguardando aprovação', tone: 'warning' },
  aprovada: { label: 'aprovada', tone: 'primary' },
  confirmada: { label: 'confirmada', tone: 'success' },
  em_espera: { label: 'em espera', tone: 'neutral' },
  cancelada: { label: 'cancelada', tone: 'neutral' },
  rejeitada: { label: 'rejeitada', tone: 'danger' },
};

const paymentInfo: Record<
  RegistrationPaymentStatus,
  { label: string; tone: 'primary' | 'neutral' | 'warning' | 'success' }
> = {
  pago: { label: 'pago', tone: 'success' },
  parcial: { label: 'pagamento parcial', tone: 'warning' },
  pendente: { label: 'pagamento pendente', tone: 'warning' },
  isento: { label: 'isento de pagamento', tone: 'neutral' },
  reembolsado: { label: 'reembolsado', tone: 'neutral' },
};

function InscricaoDetalhe() {
  const { id } = Route.useParams();
  const { data: reg, isLoading, isError } = useRegistration(id);

  if (isLoading) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/minhas-inscricoes" title="Inscrição" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  if (isError || !reg) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/minhas-inscricoes" title="Inscrição" border />
        <div className="px-6 py-16 text-center">
          <p className="font-display text-2xl">Inscrição não encontrada.</p>
        </div>
      </Page>
    );
  }

  return <DetalheView reg={reg} />;
}

function DetalheView({ reg }: { reg: RegistrationDetail }) {
  const navigate = useNavigate();
  const cancel = useCancelRegistration();
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  const status = statusInfo[reg.status];
  const payment = paymentInfo[reg.paymentStatus];
  const total = reg.priceAmount ? Number(reg.priceAmount) : 0;
  const isPaidEvent = reg.event.isPaid && total > 0;

  const canCancel =
    reg.status !== 'cancelada' &&
    reg.status !== 'confirmada' &&
    reg.status !== 'rejeitada' &&
    !reg.attended;

  const onCancel = async () => {
    setCancelError(null);
    try {
      await cancel.mutateAsync({ id: reg.id });
      setShowCancel(false);
    } catch (err) {
      setCancelError(
        err instanceof ApiError ? err.message : 'Não foi possível cancelar agora.',
      );
    }
  };

  return (
    <Page withBottomNav={false}>
      <TopBar back="/minhas-inscricoes" title="Inscrição" border />

      <div className="px-5 pt-4 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          {formatDateRange(reg.event.startDate, reg.event.endDate)}
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {reg.event.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone={status.tone}>{status.label}</Badge>
          <Badge tone={payment.tone}>{payment.label}</Badge>
          <span className="text-sm text-(color:--color-muted-foreground) ml-auto capitalize">
            como {reg.roleIntent}
          </span>
        </div>
      </div>

      <SectionTitle>Detalhes</SectionTitle>
      <div className="px-5">
        <Card>
          <CardBody>
            <div className="grid gap-4">
              <Meta
                icon={<Calendar className="size-4" strokeWidth={1.5} />}
                label="Quando"
                value={formatDateRange(reg.event.startDate, reg.event.endDate)}
              />
              {reg.event.location && (
                <Meta
                  icon={<MapPin className="size-4" strokeWidth={1.5} />}
                  label="Onde"
                  value={reg.event.location}
                />
              )}
              <Meta
                icon={<ShieldCheck className="size-4" strokeWidth={1.5} />}
                label="Inscrita em"
                value={new Date(reg.registeredAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {(isPaidEvent || reg.paymentStatus !== 'isento') && (
        <>
          <SectionTitle>Pagamento</SectionTitle>
          <div className="px-5">
            <Card>
              <CardBody>
                {isPaidEvent ? (
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm text-(color:--color-muted-foreground)">Valor</p>
                    <p
                      className="font-display text-2xl tracking-tight"
                      style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
                    >
                      {brl(total)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-(color:--color-muted-foreground)">
                    Sem custo definido pela coordenação.
                  </p>
                )}
                <Separator className="my-3" />
                <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
                  {reg.paymentStatus === 'pago'
                    ? 'Pagamento confirmado.'
                    : reg.paymentStatus === 'isento'
                      ? 'Você está isento(a).'
                      : reg.paymentStatus === 'reembolsado'
                        ? 'Reembolso processado.'
                        : 'A coordenação envia as instruções de pagamento por fora do app por enquanto.'}
                </p>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {reg.answers.length > 0 && (
        <>
          <SectionTitle>Suas respostas</SectionTitle>
          <div className="px-5 grid gap-3">
            {reg.answers.map((a) => (
              <Card key={a.id} variant="outline">
                <CardBody>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-1">
                    {a.question}
                  </p>
                  <p className="text-[15px] leading-relaxed text-pretty">
                    {renderAnswer(a.answer)}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}

      {reg.cancellationReason && (
        <>
          <SectionTitle>Cancelamento</SectionTitle>
          <div className="px-5">
            <Card variant="outline">
              <CardBody>
                <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
                  {reg.cancellationReason}
                </p>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      <div className="px-5 py-8 text-center">
        {canCancel && !showCancel && (
          <Button
            variant="ghost"
            size="sm"
            className="text-(color:--color-destructive)"
            onClick={() => setShowCancel(true)}
          >
            Cancelar inscrição
          </Button>
        )}
        {showCancel && (
          <div className="rounded-(--radius-md) border border-(color:--color-destructive)/30 bg-(color:--color-destructive)/5 p-4 text-left">
            <p className="text-sm text-(color:--color-foreground) leading-relaxed">
              Tem certeza que quer cancelar? A coordenação será avisada.
            </p>
            {cancelError && (
              <p className="mt-2 text-sm text-(color:--color-destructive)">{cancelError}</p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setShowCancel(false);
                  setCancelError(null);
                }}
              >
                Voltar
              </Button>
              <Button
                size="md"
                className="bg-(color:--color-destructive) text-white hover:bg-(color:--color-destructive)/90"
                disabled={cancel.isPending}
                onClick={onCancel}
              >
                {cancel.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Cancelando…
                  </>
                ) : (
                  'Confirmar cancelamento'
                )}
              </Button>
            </div>
          </div>
        )}
        {!canCancel && (
          <p className="text-xs text-(color:--color-muted-foreground)">
            {reg.status === 'cancelada'
              ? 'Inscrição já cancelada.'
              : reg.status === 'confirmada'
                ? 'Inscrições confirmadas só são canceladas pela coordenação.'
                : reg.status === 'rejeitada'
                  ? 'Inscrição rejeitada.'
                  : ''}
          </p>
        )}
        {reg.status === 'cancelada' && (
          <Button
            variant="link"
            size="sm"
            className="mt-3"
            onClick={() => navigate({ to: '/eventos' })}
          >
            Ver outros eventos
          </Button>
        )}
      </div>
    </Page>
  );
}

function renderAnswer(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.join(', ');
  try {
    return JSON.stringify(value);
  } catch {
    return '—';
  }
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="size-9 rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) inline-flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
          {label}
        </p>
        <p className="text-[15px] mt-0.5 leading-snug">{value}</p>
      </div>
    </div>
  );
}
