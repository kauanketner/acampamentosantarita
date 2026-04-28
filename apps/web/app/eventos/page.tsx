import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import { fetchPublicSafe } from '@/lib/api';
import { formatDateRange, toRoman } from '@/lib/format';
import type { PublicEvent } from '@/lib/types';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eventos',
  description:
    'Acampamentos, retiros, encontros e formações da comunidade Santa Rita. Veja o que vem por aí e venha — basta um sim.',
};

export const dynamic = 'force-dynamic';

const typeLabel: Record<PublicEvent['type'], string> = {
  acampamento: 'Acampamento',
  retiro: 'Retiro',
  encontro: 'Encontro',
  formacao: 'Formação',
  outro: 'Evento',
};

const statusInfo: Record<
  PublicEvent['status'],
  { label: string; tone: 'open' | 'closed' | 'live' | 'past' }
> = {
  rascunho: { label: 'Em preparação', tone: 'past' },
  inscricoes_abertas: { label: 'Inscrições abertas', tone: 'open' },
  inscricoes_fechadas: { label: 'Inscrições encerradas', tone: 'closed' },
  em_andamento: { label: 'Acontecendo agora', tone: 'live' },
  finalizado: { label: 'Memória viva', tone: 'past' },
  cancelado: { label: 'Cancelado', tone: 'past' },
};

const toneClass: Record<'open' | 'closed' | 'live' | 'past', string> = {
  open: 'text-(color:--color-moss)',
  closed: 'text-(color:--color-ink-faint)',
  live: 'text-(color:--color-oxblood)',
  past: 'text-(color:--color-ink-faint)',
};

export default async function EventosPage() {
  const data = await fetchPublicSafe<{ items: PublicEvent[] }>(
    '/upcoming-events',
    { items: [] },
    { revalidate: 60 },
  );

  const events = data.items ?? [];
  const future = events.filter(
    (e) =>
      e.status === 'inscricoes_abertas' ||
      e.status === 'inscricoes_fechadas' ||
      e.status === 'em_andamento' ||
      e.status === 'rascunho',
  );
  const past = events.filter((e) => e.status === 'finalizado');

  return (
    <>
      <section className="relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, color-mix(in oklch, var(--color-gold) 8%, transparent), transparent 50%)',
          }}
        />
        <Container width="wide" className="relative pt-12 lg:pt-20 pb-12">
          <div className="flex items-center gap-3 mb-8">
            <Logomark size={22} tone="oxblood" />
            <span className="eyebrow">Calendário · Capítulo aberto</span>
          </div>
          <h1
            className="font-display leading-[0.98] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            Próximas{' '}
            <span
              className="italic text-(color:--color-oxblood)"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              travessias.
            </span>
          </h1>
          <p className="mt-6 text-[16px] lg:text-[17px] text-(color:--color-ink-soft) max-w-2xl leading-relaxed text-pretty">
            Acampamentos, retiros e encontros da comunidade. Inscrições e pagamentos são feitos pelo
            aplicativo — clique no evento pra ver datas, local e mais.
          </p>
        </Container>
      </section>

      <section className="relative pb-24 lg:pb-32">
        <Container width="wide">
          {future.length === 0 && past.length === 0 ? (
            <Empty />
          ) : (
            <>
              {future.length > 0 && (
                <div className="space-y-4">
                  <p className="eyebrow">
                    Em breve · {future.length} evento{future.length === 1 ? '' : 's'}
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                    {future.map((e) => (
                      <EventCard key={e.id} event={e} feature />
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div className="mt-20 space-y-4">
                  <div className="ornament">
                    <span className="text-(color:--color-accent-deep)">❀</span>
                  </div>
                  <p className="eyebrow text-center">Memória viva</p>
                  <p
                    className="font-display italic text-2xl text-center text-(color:--color-ink-soft) max-w-xl mx-auto"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
                  >
                    Os que já aconteceram — e continuam vivos em quem passou.
                  </p>
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {past.map((e) => (
                      <PastEventCard key={e.id} event={e} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

function EventCard({ event, feature }: { event: PublicEvent; feature?: boolean }) {
  const status = statusInfo[event.status];
  const start = new Date(event.startDate);
  const isOpen = event.status === 'inscricoes_abertas';

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group relative paper-card rounded-(--radius-md) overflow-hidden flex flex-col lg:flex-row hover:-translate-y-0.5 hover:shadow-[0_10px_30px_color-mix(in_oklch,_black_8%,_transparent)] transition-all duration-300"
    >
      <div
        className="relative aspect-[4/3] lg:aspect-auto lg:w-[42%] vignette overflow-hidden shrink-0"
        style={
          event.coverImageUrl
            ? {
                backgroundImage: `url(${event.coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {
                background:
                  'radial-gradient(ellipse at 30% 30%, color-mix(in oklch, var(--color-gold) 35%, transparent), transparent), radial-gradient(ellipse at 80% 90%, color-mix(in oklch, var(--color-oxblood) 30%, transparent), transparent), linear-gradient(180deg, var(--color-paper-2), var(--color-paper))',
              }
        }
      >
        {!event.coverImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display italic text-(color:--color-oxblood)/30 text-[clamp(4rem,10vw,7rem)] leading-none select-none"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              aria-hidden
            >
              {typeLabel[event.type].charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <div className="paper-card rounded-(--radius-sm) px-3 py-2 text-center">
            <p className="font-mono text-[9px] uppercase tracking-wider text-(color:--color-ink-faint)">
              {start.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
            </p>
            <p
              className="font-display text-2xl leading-none tracking-tight text-(color:--color-ink) tabular"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
            >
              {start.getDate().toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 lg:p-8">
        <p className="eyebrow mb-3 flex items-center gap-2">
          <span>{typeLabel[event.type]}</span>
          {event.editionNumber && (
            <>
              <span className="text-(color:--color-rule-strong)">·</span>
              <span>Edição {toRoman(event.editionNumber)}</span>
            </>
          )}
          <span className="text-(color:--color-rule-strong)">·</span>
          <span className={toneClass[status.tone]}>{status.label}</span>
        </p>
        <h2
          className="font-display text-3xl lg:text-[34px] leading-[1.05] tracking-tight text-(color:--color-ink) group-hover:text-(color:--color-oxblood) transition-colors"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {event.name}
        </h2>
        <p className="mt-4 text-[14px] text-(color:--color-ink-soft) leading-relaxed flex-1 text-pretty line-clamp-3">
          {event.shortDescription ?? event.description ?? '—'}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 pt-5 border-t border-(color:--color-rule)/60 text-[12px]">
          <div>
            <dt className="eyebrow text-[9px]">Datas</dt>
            <dd className="text-(color:--color-ink) mt-1 tabular">
              {formatDateRange(event.startDate, event.endDate)}
            </dd>
          </div>
          {event.location && (
            <div>
              <dt className="eyebrow text-[9px]">Local</dt>
              <dd className="text-(color:--color-ink) mt-1">{event.location}</dd>
            </div>
          )}
        </dl>
        {isOpen && feature && (
          <div className="mt-5 flex items-baseline justify-between text-[12px] text-(color:--color-oxblood)">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-current" />
              Inscrições abertas
            </span>
            <span className="underline-thin">Ver detalhes →</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function PastEventCard({ event }: { event: PublicEvent }) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group block py-4 border-t border-(color:--color-rule)/60 hover:border-(color:--color-oxblood)/40 transition-colors"
    >
      <p className="eyebrow text-[9px] mb-1.5">
        {typeLabel[event.type]}
        {event.editionNumber ? ` · ${toRoman(event.editionNumber)}` : ''}
      </p>
      <h3
        className="font-display text-xl tracking-tight leading-tight group-hover:italic group-hover:text-(color:--color-oxblood) transition-all"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
      >
        {event.name}
      </h3>
      <p className="text-[11px] text-(color:--color-ink-faint) mt-1.5 tabular">
        {formatDateRange(event.startDate, event.endDate)}
      </p>
    </Link>
  );
}

function Empty() {
  return (
    <div className="paper-card rounded-(--radius-md) p-12 lg:p-16 text-center max-w-2xl mx-auto">
      <div className="ornament mb-6">
        <span className="text-(color:--color-accent-deep)">❀</span>
      </div>
      <h2
        className="font-display text-3xl tracking-tight text-(color:--color-ink)"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
      >
        Estamos preparando o próximo capítulo.
      </h2>
      <p className="mt-4 text-(color:--color-ink-soft) leading-relaxed max-w-md mx-auto">
        Não há eventos agendados no momento. Inscreva-se na nossa comunicação pra ser avisado assim
        que abrirmos as próximas datas.
      </p>
      <div className="mt-8">
        <Button href="/contato">Quero ser avisado</Button>
      </div>
    </div>
  );
}
