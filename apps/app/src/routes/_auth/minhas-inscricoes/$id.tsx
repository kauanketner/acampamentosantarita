import { Link, createFileRoute } from '@tanstack/react-router';
import { Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { brl, events, registrations } from '@/mock/data';

export const Route = createFileRoute('/_auth/minhas-inscricoes/$id')({
  component: InscricaoDetalhe,
});

function InscricaoDetalhe() {
  const { id } = Route.useParams();
  const reg = registrations.find((r) => r.id === id);
  const event = reg ? events.find((e) => e.id === reg.eventId) : undefined;

  if (!reg) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/minhas-inscricoes" title="Inscrição" />
        <div className="px-6 py-12 text-center">
          <p className="font-display text-2xl">Inscrição não encontrada.</p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <TopBar back="/minhas-inscricoes" title="Inscrição" border />

      <div className="px-5 pt-4 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          {reg.eventDates}
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {reg.eventName}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone="primary">{reg.status}</Badge>
          <Badge tone={reg.paymentStatus === 'pago' ? 'success' : 'warning'}>
            {reg.paymentStatus}
          </Badge>
          <span className="text-sm text-(color:--color-muted-foreground) ml-auto capitalize">
            como {reg.role}
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
                value={reg.eventDates}
              />
              {event && (
                <Meta
                  icon={<MapPin className="size-4" strokeWidth={1.5} />}
                  label="Onde"
                  value={event.location}
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

      <SectionTitle>Pagamento</SectionTitle>
      <div className="px-5">
        <Card>
          <CardBody>
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-(color:--color-muted-foreground)">Total</p>
              <p
                className="font-display text-2xl tracking-tight"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
              >
                {brl(reg.amount)}
              </p>
            </div>
            <Separator className="my-3" />
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-(color:--color-muted-foreground)">Pago</p>
              <p className="font-mono text-sm">{brl(reg.paymentStatus === 'pago' ? reg.amount : reg.paymentStatus === 'parcial' ? reg.amount / 2 : 0)}</p>
            </div>
            <div className="flex items-baseline justify-between mt-1.5">
              <p className="text-sm text-(color:--color-foreground) font-medium">Restante</p>
              <p
                className="font-mono text-base font-medium"
                style={{ color: reg.paymentStatus === 'pago' ? 'var(--color-primary)' : 'inherit' }}
              >
                {brl(
                  reg.paymentStatus === 'pago'
                    ? 0
                    : reg.paymentStatus === 'parcial'
                      ? reg.amount / 2
                      : reg.amount,
                )}
              </p>
            </div>
          </CardBody>
          {reg.paymentStatus !== 'pago' && reg.paymentStatus !== 'isento' && (
            <div className="border-t border-(color:--color-border) p-4 bg-(color:--color-surface-elevated)">
              <Button asChild block size="md">
                <Link to="/financeiro">Pagar agora</Link>
              </Button>
            </div>
          )}
        </Card>
      </div>

      <SectionTitle>Suas respostas</SectionTitle>
      <div className="px-5 grid gap-3">
        <Card variant="outline">
          <CardBody>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-1">
              Por que você quer servir nesta edição?
            </p>
            <p className="text-[15px] leading-relaxed text-pretty">
              Sinto que é hora de devolver um pouco do que recebi.
            </p>
          </CardBody>
        </Card>
        <Card variant="outline">
          <CardBody>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-1">
              Equipe que gostaria de servir
            </p>
            <p className="text-[15px]">Bem-Estar</p>
          </CardBody>
        </Card>
      </div>

      <div className="px-5 py-8 text-center">
        <Button variant="ghost" size="sm" className="text-(color:--color-destructive)">
          Cancelar inscrição
        </Button>
      </div>
    </Page>
  );
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
