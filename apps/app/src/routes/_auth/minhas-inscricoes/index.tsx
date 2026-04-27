import { Link, createFileRoute } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { ArchGlyph } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { brl, registrations } from '@/mock/data';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/minhas-inscricoes/')({
  component: MinhasInscricoes,
});

const statusInfo: Record<
  string,
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
  string,
  { label: string; tone: 'primary' | 'neutral' | 'warning' | 'success' }
> = {
  pago: { label: 'pago', tone: 'success' },
  parcial: { label: 'parcial', tone: 'warning' },
  pendente: { label: 'pendente', tone: 'warning' },
  isento: { label: 'isento', tone: 'neutral' },
  reembolsado: { label: 'reembolsado', tone: 'neutral' },
};

function MinhasInscricoes() {
  const upcoming = registrations.filter((r) =>
    ['pendente', 'aprovada', 'em_espera'].includes(r.status),
  );
  const past = registrations.filter((r) => ['confirmada', 'cancelada', 'rejeitada'].includes(r.status));

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

      {upcoming.length === 0 && past.length === 0 && (
        <EmptyState
          className="py-20"
          icon={<Heart className="size-10" strokeWidth={1.2} />}
          title="Sem inscrições por enquanto"
          description="Quando você se inscrever em algum evento, ele aparece aqui."
        />
      )}

      {upcoming.length > 0 && (
        <>
          <SectionTitle>Em curso</SectionTitle>
          <div className="px-5 grid gap-3">
            {upcoming.map((r) => (
              <RegistrationRow key={r.id} {...r} />
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <SectionTitle>Memória</SectionTitle>
          <div className="px-5 grid gap-3 pb-6">
            {past.map((r) => (
              <RegistrationRow key={r.id} {...r} muted />
            ))}
          </div>
        </>
      )}

      <div className="px-5 pb-4 flex flex-col items-center text-(color:--color-muted-foreground)">
        <ArchGlyph className="size-6 opacity-30" />
      </div>
    </Page>
  );
}

function RegistrationRow({
  id,
  eventName,
  eventDates,
  role,
  status,
  paymentStatus,
  amount,
  muted,
}: {
  id: string;
  eventName: string;
  eventDates: string;
  role: 'campista' | 'equipista';
  status: keyof typeof statusInfo;
  paymentStatus: keyof typeof paymentInfo;
  amount: number;
  muted?: boolean;
}) {
  return (
    <Link
      to="/minhas-inscricoes/$id"
      params={{ id }}
      className={cn(
        'block surface-warmth rounded-(--radius-lg) border border-(color:--color-border) p-5 transition active:scale-[0.99]',
        muted && 'opacity-75',
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-1">
        {eventDates}
      </p>
      <h3
        className="font-display text-xl tracking-tight leading-[1.1] text-balance"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
      >
        {eventName}
      </h3>
      <p className="text-xs text-(color:--color-muted-foreground) mt-1 capitalize">
        Como {role}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={statusInfo[status]?.tone}>{statusInfo[status]?.label}</Badge>
        <Badge tone={paymentInfo[paymentStatus]?.tone}>
          {paymentInfo[paymentStatus]?.label}
        </Badge>
        {amount > 0 && (
          <span className="font-mono text-[11px] text-(color:--color-muted-foreground) ml-auto">
            {brl(amount)}
          </span>
        )}
      </div>
    </Link>
  );
}
