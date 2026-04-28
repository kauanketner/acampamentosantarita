import { Button } from '@/components/ui/Button';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { fetchPublicSafe } from '@/lib/api';
import { formatDateRange, toRoman } from '@/lib/format';
import type { PublicEvent } from '@/lib/types';
import Link from 'next/link';

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

export async function UpcomingEvents() {
  const data = await fetchPublicSafe<{ items: PublicEvent[] }>(
    '/upcoming-events',
    { items: [] },
    { revalidate: 120 },
  );

  const upcoming = (data.items ?? [])
    .filter(
      (e) =>
        e.status === 'inscricoes_abertas' ||
        e.status === 'inscricoes_fechadas' ||
        e.status === 'em_andamento',
    )
    .slice(0, 3);

  // Fallback de mostra: se o backend está vazio, ainda assim renderiza placeholder.
  const fallback: PublicEvent[] = [
    {
      id: 'fb-1',
      slug: 'acampamento-de-verao',
      name: 'Acampamento de Verão',
      type: 'acampamento',
      status: 'inscricoes_abertas',
      editionNumber: 22,
      startDate: new Date(new Date().getFullYear(), 6, 17).toISOString(),
      endDate: new Date(new Date().getFullYear(), 6, 20).toISOString(),
      location: 'Sítio Santa Rita · Atibaia, SP',
      shortDescription: 'Quatro dias de oração, comunhão e descanso. Para campistas e equipistas.',
    },
    {
      id: 'fb-2',
      slug: 'retiro-quaresma',
      name: 'Retiro de Quaresma',
      type: 'retiro',
      status: 'inscricoes_abertas',
      editionNumber: null,
      startDate: new Date(new Date().getFullYear(), 2, 15).toISOString(),
      endDate: new Date(new Date().getFullYear(), 2, 17).toISOString(),
      location: 'Casa de Retiros São Camilo',
      shortDescription:
        'Três dias de silêncio guiado, com momentos de adoração e direção espiritual.',
    },
    {
      id: 'fb-3',
      slug: 'formacao-equipe',
      name: 'Formação para Equipistas',
      type: 'formacao',
      status: 'inscricoes_abertas',
      editionNumber: null,
      startDate: new Date(new Date().getFullYear(), 4, 10).toISOString(),
      endDate: new Date(new Date().getFullYear(), 4, 10).toISOString(),
      location: 'Paróquia Santa Rita · São Paulo',
      shortDescription:
        'Encontro mensal para quem serve nos acampamentos. Aberto a quem deseja conhecer.',
    },
  ];

  const events = upcoming.length > 0 ? upcoming : fallback;

  return (
    <section className="relative py-24 lg:py-32 bg-(color:--color-paper-2)/60">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <Chapter
            numeral="II"
            eyebrow="Capítulo dois · Calendário"
            title={
              <>
                Próximas{' '}
                <span
                  className="italic text-(color:--color-oxblood)"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
                >
                  travessias.
                </span>
              </>
            }
            description="Cada evento é um chamado. Veja o que vem por aí e venha — basta um sim."
          />
          <Button href="/eventos" variant="outline" size="md">
            Ver todos os eventos →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function EventCard({ event }: { event: PublicEvent }) {
  const status = statusInfo[event.status];
  const start = new Date(event.startDate);
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group relative paper-card rounded-(--radius-md) overflow-hidden flex flex-col animate-drift-up hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_8px_30px_color-mix(in_oklch,_black_8%,_transparent)]"
    >
      {/* Cover area: usa imagem se houver, senão render decorativo */}
      <div
        className="aspect-[4/3] relative overflow-hidden vignette"
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
              className="font-display italic text-(color:--color-oxblood)/30 text-[clamp(3rem,8vw,5rem)] leading-none select-none"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              aria-hidden
            >
              {typeLabel[event.type].charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`eyebrow inline-flex items-center gap-1.5 ${toneClass[status.tone]}`}>
            <span className="size-1.5 rounded-full bg-current" />
            {status.label}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="paper-card rounded-(--radius-sm) px-2.5 py-1.5 text-center">
            <p className="font-mono text-[9px] uppercase tracking-wider text-(color:--color-ink-faint)">
              {start.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
            </p>
            <p
              className="font-display text-xl leading-none tracking-tight text-(color:--color-ink) tabular"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
            >
              {start.getDate().toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 lg:p-7">
        <p className="eyebrow mb-3">
          {typeLabel[event.type]}
          {event.editionNumber ? ` · Edição ${toRoman(event.editionNumber)}` : ''}
        </p>
        <h3
          className="font-display text-2xl leading-tight tracking-tight text-(color:--color-ink) group-hover:text-(color:--color-oxblood) transition-colors mb-3"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {event.name}
        </h3>
        <p className="text-[14px] text-(color:--color-ink-soft) leading-relaxed mb-6 flex-1 text-pretty">
          {event.shortDescription ?? event.description ?? '—'}
        </p>
        <div className="flex items-baseline justify-between text-[12px] text-(color:--color-ink-faint) border-t border-(color:--color-rule)/60 pt-4">
          <span className="tabular">{formatDateRange(event.startDate, event.endDate)}</span>
          {event.location && (
            <span className="truncate max-w-[60%] text-right">{event.location}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
