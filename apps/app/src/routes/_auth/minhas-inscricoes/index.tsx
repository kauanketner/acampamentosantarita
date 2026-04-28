import { ArchGlyph } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/cn';
import { brl, formatDateRange } from '@/lib/format';
import {
  type RegistrationListItem,
  type RegistrationPaymentStatus,
  type RegistrationStatus,
  useMyRegistrations,
} from '@/lib/queries/registrations';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Heart, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/_auth/minhas-inscricoes/')({
  component: MinhasInscricoes,
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
  parcial: { label: 'parcial', tone: 'warning' },
  pendente: { label: 'pagamento pendente', tone: 'warning' },
  isento: { label: 'isento', tone: 'neutral' },
  reembolsado: { label: 'reembolsado', tone: 'neutral' },
};

function MinhasInscricoes() {
  const { data: registrations, isLoading, isError } = useMyRegistrations();

  return (
    <Page>
      <div className="safe-top" />
      <PageHeader
        eyebrow="Suas presenças"
        title={
          <>
            Minhas
            <br />
            <span className="font-display-italic">inscrições.</span>
          </>
        }
        className="pt-12"
      />

      {isLoading && (
        <div className="flex justify-center py-20 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {isError && (
        <EmptyState
          className="py-16"
          icon={<Heart className="size-10" strokeWidth={1.2} />}
          title="Não conseguimos buscar suas inscrições"
          description="Tente de novo daqui a pouco."
        />
      )}

      {registrations && <RegistrationList registrations={registrations} />}

      <div className="px-5 pb-4 flex flex-col items-center text-(color:--color-muted-foreground)">
        <ArchGlyph className="size-6 opacity-30" />
      </div>
    </Page>
  );
}

function RegistrationList({
  registrations,
}: {
  registrations: RegistrationListItem[];
}) {
  const upcoming = registrations.filter((r) =>
    (['pendente', 'aprovada', 'em_espera'] as RegistrationStatus[]).includes(r.status),
  );
  const past = registrations.filter((r) =>
    (['confirmada', 'cancelada', 'rejeitada'] as RegistrationStatus[]).includes(r.status),
  );

  if (upcoming.length === 0 && past.length === 0) {
    return (
      <EmptyState
        className="py-20"
        icon={<Heart className="size-10" strokeWidth={1.2} />}
        title="Sem inscrições por enquanto"
        description="Quando você se inscrever em algum evento, ele aparece aqui."
      />
    );
  }

  return (
    <>
      {upcoming.length > 0 && (
        <>
          <SectionTitle>Em curso</SectionTitle>
          <div className="px-5 grid gap-3">
            {upcoming.map((r) => (
              <RegistrationRow key={r.id} reg={r} />
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <SectionTitle>Memória</SectionTitle>
          <div className="px-5 grid gap-3 pb-6">
            {past.map((r) => (
              <RegistrationRow key={r.id} reg={r} muted />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function RegistrationRow({
  reg,
  muted,
}: {
  reg: RegistrationListItem;
  muted?: boolean;
}) {
  const status = statusInfo[reg.status];
  const payment = paymentInfo[reg.paymentStatus];
  const amount = reg.priceAmount ? Number(reg.priceAmount) : 0;
  return (
    <Link
      to="/minhas-inscricoes/$id"
      params={{ id: reg.id }}
      className={cn(
        'block surface-warmth rounded-(--radius-lg) border border-(color:--color-border) p-5 transition active:scale-[0.99]',
        muted && 'opacity-75',
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-1">
        {formatDateRange(reg.event.startDate, reg.event.endDate)}
      </p>
      <h3
        className="font-display text-xl tracking-tight leading-[1.1] text-balance"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
      >
        {reg.event.name}
      </h3>
      <p className="text-xs text-(color:--color-muted-foreground) mt-1 capitalize">
        Como {reg.roleIntent}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={status.tone}>{status.label}</Badge>
        <Badge tone={payment.tone}>{payment.label}</Badge>
        {amount > 0 && (
          <span className="font-mono text-[11px] text-(color:--color-muted-foreground) ml-auto">
            {brl(amount)}
          </span>
        )}
      </div>
    </Link>
  );
}
