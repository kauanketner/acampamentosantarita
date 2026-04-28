import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import { fetchPublicSafe } from '@/lib/api';
import { brl, formatDate, formatDateRange, toRoman } from '@/lib/format';
import type { PublicEvent } from '@/lib/types';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchPublicSafe<PublicEvent | null>(`/event/${slug}`, null);
  if (!event) return { title: 'Evento não encontrado' };
  return {
    title: event.name,
    description: event.shortDescription ?? event.description ?? undefined,
  };
}

export default async function EventoDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const event = await fetchPublicSafe<PublicEvent | null>(`/event/${slug}`, null);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.acampamentosantarita.com.br';

  if (!event) {
    notFound();
  }

  const status = statusInfo[event.status];
  const isOpen = event.status === 'inscricoes_abertas';
  const _start = new Date(event.startDate);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={
            event.coverImageUrl
              ? {
                  backgroundImage: `linear-gradient(180deg, color-mix(in oklch, var(--color-paper) 50%, transparent), var(--color-paper)), url(${event.coverImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {
                  background:
                    'radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in oklch, var(--color-gold) 12%, transparent), transparent 60%), radial-gradient(circle at 12% 110%, color-mix(in oklch, var(--color-oxblood) 8%, transparent), transparent 50%)',
                }
          }
        />
        <Container width="editorial" className="relative pt-10 lg:pt-16 pb-16 lg:pb-24">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-1.5 eyebrow text-(color:--color-ink-faint) hover:text-(color:--color-ink) transition-colors mb-8"
          >
            <span aria-hidden>←</span> Eventos
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <Logomark size={20} tone="oxblood" />
            <span className="eyebrow">
              {typeLabel[event.type]}
              {event.editionNumber ? ` · Edição ${toRoman(event.editionNumber)}` : ''}
            </span>
          </div>

          <h1
            className="font-display leading-[0.98] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.25rem, 6.4vw, 5.25rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            {event.name}
          </h1>

          {event.shortDescription && (
            <p
              className="mt-6 font-display italic text-[20px] lg:text-[24px] leading-[1.45] text-(color:--color-ink-soft) max-w-2xl text-pretty"
              style={{ fontVariationSettings: "'opsz' 32, 'SOFT' 90" }}
            >
              {event.shortDescription}
            </p>
          )}

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-(color:--color-rule)/60 paper-card rounded-(--radius-md) overflow-hidden max-w-3xl">
            <Detail label="Datas" value={formatDateRange(event.startDate, event.endDate)} />
            <Detail label="Local" value={event.location ?? '—'} />
            <Detail
              label="Inscrição"
              value={
                <span
                  className={
                    status.tone === 'open'
                      ? 'text-(color:--color-moss)'
                      : status.tone === 'live'
                        ? 'text-(color:--color-oxblood)'
                        : ''
                  }
                >
                  {status.label}
                </span>
              }
            />
            <Detail
              label="Vagas"
              value={event.maxParticipants ? `${event.maxParticipants}` : 'A combinar'}
            />
          </div>

          {isOpen && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={appUrl} external size="lg">
                Inscrever-se pelo app
                <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
                  <path
                    d="M3 9L9 3M9 3H4M9 3V8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
              <Button href="/contato" variant="outline" size="lg">
                Tenho dúvidas
              </Button>
            </div>
          )}
          {!isOpen && event.status === 'finalizado' && (
            <p className="mt-8 text-[14px] text-(color:--color-ink-soft)">
              Este evento já aconteceu. Veja a{' '}
              <Link href="/galeria" className="text-(color:--color-oxblood) underline-thin">
                galeria
              </Link>{' '}
              ou acompanhe os{' '}
              <Link href="/eventos" className="text-(color:--color-oxblood) underline-thin">
                próximos
              </Link>
              .
            </p>
          )}
        </Container>
      </section>

      {/* Corpo */}
      <section className="relative py-16 lg:py-24 border-t border-(color:--color-rule)">
        <Container width="editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <article className="lg:col-span-7 space-y-6 prose-editorial">
              <p className="eyebrow">Sobre este evento</p>
              {event.description ? (
                <div
                  className="font-display text-[18px] lg:text-[19px] leading-[1.8] text-(color:--color-ink) space-y-5"
                  style={{ fontVariationSettings: "'opsz' 32, 'SOFT' 30" }}
                >
                  {event.description.split(/\n{2,}/).map((para, idx) => (
                    <p key={`${event.id}-p-${idx}`} className={idx === 0 ? 'drop-cap' : undefined}>
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-(color:--color-ink-soft) text-[15px] leading-relaxed">
                  Os detalhes deste evento serão publicados em breve. Se quiser saber mais, fale com
                  a coordenação.
                </p>
              )}
            </article>

            <aside className="lg:col-span-5 space-y-4">
              {(event.priceCampista || event.priceEquipista) && (
                <div className="paper-card rounded-(--radius-md) p-6">
                  <p className="eyebrow mb-4">Investimento</p>
                  <dl className="space-y-3">
                    {event.priceCampista && (
                      <div className="flex items-baseline justify-between border-b border-(color:--color-rule)/60 pb-3">
                        <dt className="text-[13px]">Campista</dt>
                        <dd
                          className="font-display text-2xl tabular tracking-tight text-(color:--color-ink)"
                          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
                        >
                          {brl(Number(event.priceCampista))}
                        </dd>
                      </div>
                    )}
                    {event.priceEquipista && (
                      <div className="flex items-baseline justify-between">
                        <dt className="text-[13px]">Equipista</dt>
                        <dd
                          className="font-display text-2xl tabular tracking-tight text-(color:--color-ink)"
                          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
                        >
                          {brl(Number(event.priceEquipista))}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <p className="text-[11px] text-(color:--color-ink-faint) mt-4 leading-relaxed">
                    Pagamento via PIX, cartão ou em parcelas. Tudo pelo app.
                  </p>
                </div>
              )}

              {event.registrationDeadline && (
                <div className="paper-card rounded-(--radius-md) p-6">
                  <p className="eyebrow mb-3">Prazo de inscrição</p>
                  <p
                    className="font-display text-xl tracking-tight"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                  >
                    {formatDate(event.registrationDeadline)}
                  </p>
                  <p className="text-[12px] text-(color:--color-ink-faint) mt-2">
                    Não deixe pra última hora — a coordenação aprova as inscrições com calma.
                  </p>
                </div>
              )}

              <div className="paper-card rounded-(--radius-md) p-6 space-y-3">
                <p className="eyebrow">Como acontece</p>
                <ul className="space-y-2.5 text-[13px] text-(color:--color-ink-soft) leading-relaxed">
                  <li className="flex gap-3">
                    <span className="font-display italic text-(color:--color-oxblood) leading-none mt-0.5">
                      I.
                    </span>
                    <span>Você se inscreve pelo app, com sua ficha e a opção de pagamento.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display italic text-(color:--color-oxblood) leading-none mt-0.5">
                      II.
                    </span>
                    <span>A coordenação revisa e confirma. Você é avisado por push.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display italic text-(color:--color-oxblood) leading-none mt-0.5">
                      III.
                    </span>
                    <span>No dia, é só chegar. A gente te recebe com café e abraço.</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="py-16 border-t border-(color:--color-rule) bg-(color:--color-paper-2)/40">
        <Container width="reading" className="text-center">
          <p className="eyebrow mb-4">Mais</p>
          <p
            className="font-display italic text-2xl text-(color:--color-ink-soft) leading-snug"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
          >
            Veja outros eventos da comunidade.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button href="/eventos" variant="outline">
              Voltar pra agenda
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-(color:--color-paper) p-4 lg:p-5">
      <p className="eyebrow text-[9px] mb-1.5">{label}</p>
      <p className="text-[13px] lg:text-[14px] text-(color:--color-ink) leading-snug font-medium">
        {value}
      </p>
    </div>
  );
}
