import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, Bell, CalendarDays, Heart, Sparkles, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { EventCover } from '@/components/EventCover';
import { ArchGlyph } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import {
  announcements,
  brl,
  events,
  formatDateRange,
  invoices,
  me,
  posTransactions,
} from '@/mock/data';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/')({
  component: HomePage,
});

function HomePage() {
  const nextEvent = events.find((e) => e.status === 'inscricoes_abertas');
  const lastAnnouncement = announcements[0];
  const pendingInvoice = invoices.find((i) => i.status === 'pendente' || i.status === 'parcial');
  const posTotal = posTransactions.reduce((acc, t) => acc + t.total, 0);

  const greeting = getGreeting();

  return (
    <Page>
      {/* Top — saudação calma com avatar */}
      <header className="px-5 pt-16 pb-3 safe-top flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-1">
            {greeting}
          </p>
          <h1
            className="font-display text-[clamp(2rem,9vw,2.6rem)] leading-[1] tracking-[-0.025em]"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            {me.firstName}
          </h1>
          <p className="mt-1.5 text-sm text-(color:--color-muted-foreground)">
            {me.campCount} acampamentos · {me.city}/{me.state}
          </p>
        </div>
        <Link to="/perfil">
          <Avatar name={me.fullName} size="md" ringed={me.isVeteran} />
        </Link>
      </header>

      {/* Próximo evento — hero card editorial */}
      {nextEvent && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="px-5 pt-3"
        >
          <Link to="/eventos/$slug" params={{ slug: nextEvent.slug }} className="block group">
            <EventCover gradient={nextEvent.coverGradient} height="lg" className="mb-0">
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge tone="accent" className="bg-white/20 text-white backdrop-blur-sm">
                    Próximo
                  </Badge>
                  {nextEvent.spotsLeft && nextEvent.spotsLeft < 20 && (
                    <Badge tone="warning" className="bg-white/15 text-white backdrop-blur-sm">
                      últimas {nextEvent.spotsLeft} vagas
                    </Badge>
                  )}
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-80 mb-1">
                  {formatDateRange(nextEvent.startDate, nextEvent.endDate)}
                </p>
                <h2
                  className="font-display text-3xl leading-[1.05] tracking-tight max-w-[18ch] text-balance"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                >
                  {nextEvent.name}
                </h2>
                <p className="mt-1 text-sm opacity-90 italic">{nextEvent.shortDescription}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium opacity-95 group-hover:translate-x-0.5 transition">
                  Ver detalhes <ArrowUpRight className="size-4" strokeWidth={2} />
                </div>
              </div>
            </EventCover>
          </Link>
        </motion.section>
      )}

      {/* Atalhos */}
      <SectionTitle>Atalhos</SectionTitle>
      <div className="px-5 grid grid-cols-2 gap-3">
        <ShortcutCard
          to="/eventos"
          icon={<CalendarDays className="size-5" strokeWidth={1.5} />}
          label="Eventos"
          subtitle="O que vem aí"
        />
        <ShortcutCard
          to="/minhas-inscricoes"
          icon={<Heart className="size-5" strokeWidth={1.5} />}
          label="Inscrições"
          subtitle="Suas presenças"
        />
        <ShortcutCard
          to="/financeiro"
          icon={<Wallet className="size-5" strokeWidth={1.5} />}
          label="Financeiro"
          subtitle={pendingInvoice ? `${brl(pendingInvoice.amount - pendingInvoice.paid)} aberto` : 'Em dia'}
          highlight={!!pendingInvoice}
        />
        <ShortcutCard
          to="/tribo"
          icon={<Sparkles className="size-5" strokeWidth={1.5} />}
          label="Tribo"
          subtitle="—"
          mystery
        />
      </div>

      {/* PDV — só se há conta com saldo */}
      {posTotal > 0 && (
        <>
          <SectionTitle>Conta no evento</SectionTitle>
          <div className="px-5">
            <Link
              to="/financeiro/pdv-evento"
              className="block surface-warmth rounded-(--radius-lg) border border-(color:--color-border) p-5"
            >
              <div className="flex items-baseline justify-between mb-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                  14º Acampamento · cantina
                </p>
                <ArrowUpRight className="size-4 text-(color:--color-muted-foreground)" />
              </div>
              <p
                className="font-display text-3xl tracking-tight"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
              >
                {brl(posTotal)}
              </p>
              <p className="text-sm text-(color:--color-muted-foreground) mt-1">
                {posTransactions.length} lançamentos. Pague quando quiser.
              </p>
            </Link>
          </div>
        </>
      )}

      {/* Último aviso */}
      {lastAnnouncement && (
        <>
          <SectionTitle
            trailing={
              <Link
                to="/avisos"
                className="text-[11px] uppercase tracking-wider hover:text-(color:--color-primary)"
              >
                Ver tudo
              </Link>
            }
          >
            Aviso recente
          </SectionTitle>
          <div className="px-5 pb-8">
            <Card>
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 size-9 rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) inline-flex items-center justify-center">
                    <Bell className="size-4" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[15px] leading-snug">
                      {lastAnnouncement.title}
                    </p>
                    <p className="text-sm text-(color:--color-muted-foreground) mt-1 line-clamp-2 leading-relaxed">
                      {lastAnnouncement.body}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-subtle) mt-2">
                      {timeAgo(lastAnnouncement.publishedAt)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {/* Respiro discreto no rodapé do feed */}
      <div className="px-5 pb-4 flex justify-center text-(color:--color-muted-foreground)">
        <ArchGlyph className="size-6 opacity-30" />
      </div>
    </Page>
  );
}

function ShortcutCard({
  to,
  icon,
  label,
  subtitle,
  highlight,
  mystery,
}: {
  to: '/eventos' | '/minhas-inscricoes' | '/financeiro' | '/tribo';
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  highlight?: boolean;
  mystery?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'block rounded-(--radius-lg) p-4 border surface-warmth transition active:scale-[0.99]',
        highlight && 'border-(color:--color-primary) bg-(color:--color-primary-soft)',
        mystery && 'border-(color:--color-mystery)/30 bg-(color:--color-mystery)/5',
        !highlight && !mystery && 'border-(color:--color-border)',
      )}
    >
      <div
        className={cn(
          'size-9 rounded-full inline-flex items-center justify-center mb-2',
          highlight && 'bg-(color:--color-primary) text-(color:--color-primary-foreground)',
          mystery && 'bg-(color:--color-mystery) text-(color:--color-mystery-foreground)',
          !highlight && !mystery && 'bg-(color:--color-primary-soft) text-(color:--color-primary)',
        )}
      >
        {icon}
      </div>
      <p className="font-medium text-[15px]">{label}</p>
      <p className="text-xs text-(color:--color-muted-foreground) mt-0.5">{subtitle}</p>
    </Link>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Madrugada serena';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora há pouco';
  if (m < 60) return `${m} min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
}
