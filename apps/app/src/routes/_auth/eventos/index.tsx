import { Link, createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { EventCover } from '@/components/EventCover';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { events, formatDateRange } from '@/mock/data';

const typeLabel: Record<string, string> = {
  acampamento: 'Acampamento',
  retiro: 'Retiro',
  encontro: 'Encontro',
  formacao: 'Formação',
};

const statusInfo: Record<string, { label: string; tone: 'primary' | 'neutral' | 'warning' }> = {
  inscricoes_abertas: { label: 'inscrições abertas', tone: 'primary' },
  inscricoes_fechadas: { label: 'inscrições fechadas', tone: 'neutral' },
  em_andamento: { label: 'acontecendo agora', tone: 'warning' },
  finalizado: { label: 'finalizado', tone: 'neutral' },
};

export const Route = createFileRoute('/_auth/eventos/')({
  component: EventosIndex,
});

function EventosIndex() {
  const upcoming = events.filter(
    (e) => e.status === 'inscricoes_abertas' || e.status === 'inscricoes_fechadas' || e.status === 'em_andamento',
  );
  const past = events.filter((e) => e.status === 'finalizado');

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

      <SectionTitle>Por vir</SectionTitle>
      <div className="px-5 grid gap-4">
        {upcoming.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Link
              to="/eventos/$slug"
              params={{ slug: e.slug }}
              className="block group"
            >
              <EventCover gradient={e.coverGradient} height="md" className="mb-3">
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                  <div className="flex justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-90">
                      {typeLabel[e.type]}
                      {e.editionNumber ? ` · ${e.editionNumber}º` : ''}
                    </span>
                    <Badge
                      tone="neutral"
                      className="bg-white/15 text-white backdrop-blur-sm uppercase"
                    >
                      {statusInfo[e.status]?.label}
                    </Badge>
                  </div>
                  <div>
                    <h3
                      className="font-display text-2xl leading-[1.05] tracking-tight max-w-[15ch] text-balance"
                      style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                    >
                      {e.name}
                    </h3>
                    <p className="text-sm opacity-90 mt-1">
                      {formatDateRange(e.startDate, e.endDate)}
                    </p>
                  </div>
                </div>
              </EventCover>
              <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
                {e.shortDescription} · <span className="text-(color:--color-foreground)">{e.location}</span>
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {past.length > 0 && (
        <>
          <SectionTitle>Memória</SectionTitle>
          <div className="px-5 grid gap-3 pb-6">
            {past.map((e) => (
              <Link
                key={e.id}
                to="/eventos/$slug"
                params={{ slug: e.slug }}
                className="flex items-center gap-3 p-3 rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) hover:bg-(color:--color-muted) transition"
              >
                <span
                  className="size-12 rounded-(--radius-sm) shrink-0"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${e.coverGradient[0]}, ${e.coverGradient[1]})`,
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
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
