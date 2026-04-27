import { Link, createFileRoute } from '@tanstack/react-router';
import { CalendarDays, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { EventCover } from '@/components/EventCover';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { type AppEvent, type EventStatus, useUpcomingEvents } from '@/lib/queries/events';
import { eventGradient, formatDateRange } from '@/lib/format';
import { mediaUrl } from '@/lib/queries/profile';

const typeLabel: Record<string, string> = {
  acampamento: 'Acampamento',
  retiro: 'Retiro',
  encontro: 'Encontro',
  formacao: 'Formação',
  outro: 'Evento',
};

const statusInfo: Record<
  EventStatus,
  { label: string; tone: 'primary' | 'neutral' | 'warning' }
> = {
  rascunho: { label: 'rascunho', tone: 'neutral' },
  inscricoes_abertas: { label: 'inscrições abertas', tone: 'primary' },
  inscricoes_fechadas: { label: 'inscrições fechadas', tone: 'neutral' },
  em_andamento: { label: 'acontecendo agora', tone: 'warning' },
  finalizado: { label: 'finalizado', tone: 'neutral' },
  cancelado: { label: 'cancelado', tone: 'neutral' },
};

export const Route = createFileRoute('/_auth/eventos/')({
  component: EventosIndex,
});

function EventosIndex() {
  const { data: events, isLoading, isError } = useUpcomingEvents();

  return (
    <Page>
      <div className="safe-top" />
      <PageHeader
        eyebrow="Próximos passos"
        title={
          <>
            Eventos da
            <br />
            <span className="font-display-italic">comunidade.</span>
          </>
        }
        description="Acampamentos, retiros, encontros e formações. Você se inscreve naqueles que o coração indicar."
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
          icon={<CalendarDays className="size-10" strokeWidth={1.2} />}
          title="Não conseguimos buscar os eventos"
          description="Tente de novo daqui a pouco."
        />
      )}

      {events && <EventList events={events} />}
    </Page>
  );
}

function EventList({ events }: { events: AppEvent[] }) {
  const upcoming = events.filter(
    (e) =>
      e.status === 'inscricoes_abertas' ||
      e.status === 'inscricoes_fechadas' ||
      e.status === 'em_andamento',
  );
  const past = events
    .filter((e) => e.status === 'finalizado')
    .slice()
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  if (upcoming.length === 0 && past.length === 0) {
    return (
      <EmptyState
        className="py-16"
        icon={<CalendarDays className="size-10" strokeWidth={1.2} />}
        title="Nenhum evento por enquanto"
        description="Quando o time da comunidade abrir um novo evento, ele aparece aqui."
      />
    );
  }

  return (
    <>
      {upcoming.length > 0 && (
        <>
          <SectionTitle>Por vir</SectionTitle>
          <div className="px-5 grid gap-4">
            {upcoming.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <EventCard event={e} />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <SectionTitle>Memória</SectionTitle>
          <div className="px-5 grid gap-3 pb-8">
            {past.map((e) => {
              const grad = eventGradient(e.id);
              return (
                <Link
                  key={e.id}
                  to="/eventos/$slug"
                  params={{ slug: e.slug }}
                  className="flex items-center gap-3 p-3 rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) hover:bg-(color:--color-muted) transition"
                >
                  <span
                    className="size-12 rounded-(--radius-sm) shrink-0 overflow-hidden"
                    style={{
                      backgroundImage: e.coverImageUrl
                        ? `url("${mediaUrl(e.coverImageUrl)}")`
                        : `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium leading-tight">{e.name}</p>
                    <p className="text-xs text-(color:--color-muted-foreground) mt-0.5">
                      {formatDateRange(e.startDate, e.endDate)}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-subtle)">
                    finalizado
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function EventCard({ event }: { event: AppEvent }) {
  const status = statusInfo[event.status];
  const grad = eventGradient(event.id);
  const cover = mediaUrl(event.coverImageUrl);
  return (
    <Link to="/eventos/$slug" params={{ slug: event.slug }} className="block group">
      <EventCover
        gradient={grad}
        imageUrl={cover}
        height="md"
        className="mb-3"
      >
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          <div className="flex justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-90">
              {typeLabel[event.type] ?? 'Evento'}
              {event.editionNumber ? ` · ${event.editionNumber}º` : ''}
            </span>
            {status && (
              <Badge
                tone={status.tone}
                className="bg-white/15 text-white backdrop-blur-sm uppercase border-white/20"
              >
                {status.label}
              </Badge>
            )}
          </div>
          <div>
            <h3
              className="font-display text-2xl leading-[1.05] tracking-tight max-w-[15ch] text-balance"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
            >
              {event.name}
            </h3>
            <p className="text-sm opacity-90 mt-1">
              {formatDateRange(event.startDate, event.endDate)}
            </p>
          </div>
        </div>
      </EventCover>
      <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
        {event.location ?? 'Local a confirmar'}
      </p>
    </Link>
  );
}
