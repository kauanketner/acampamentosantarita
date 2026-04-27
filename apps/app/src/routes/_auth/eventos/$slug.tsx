import { Link, createFileRoute } from '@tanstack/react-router';
import { Calendar, Clock, Loader2, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { EventCover } from '@/components/EventCover';
import { ArchGlyph } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { brl, eventGradient, formatDateRange } from '@/lib/format';
import { useEventBySlug } from '@/lib/queries/events';
import { mediaUrl } from '@/lib/queries/profile';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/eventos/$slug')({
  component: EventoDetalhe,
});

const typeLabel: Record<string, string> = {
  acampamento: 'Acampamento',
  retiro: 'Retiro',
  encontro: 'Encontro',
  formacao: 'Formação',
  outro: 'Evento',
};

function EventoDetalhe() {
  const { slug } = Route.useParams();
  const { data: event, isLoading, isError } = useEventBySlug(slug);

  if (isLoading) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/eventos" />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  if (isError || !event) {
    return (
      <Page withBottomNav={false}>
        <TopBar back="/eventos" />
        <div className="px-6 py-16 text-center">
          <p className="font-display text-2xl">Não encontrado.</p>
          <p className="text-sm text-(color:--color-muted-foreground) mt-2">
            Talvez o evento tenha sido removido.
          </p>
        </div>
      </Page>
    );
  }

  const open = event.status === 'inscricoes_abertas' && event.allowRegistrationViaApp;
  const grad = eventGradient(event.id);
  const cover = mediaUrl(event.coverImageUrl);

  // primeiro parágrafo da descrição vira lead/short, o resto vira corpo
  const desc = (event.description ?? '').trim();
  const [lead, ...rest] = desc.split(/\n{2,}/);
  const body = rest.join('\n\n');

  return (
    <Page>
      {/* full-bleed cover + sticky overlay top bar */}
      <div className="relative">
        <EventCover
          gradient={grad}
          imageUrl={cover}
          height="xl"
          withMotif
          className="rounded-none"
        />
        <div className="absolute inset-x-0 top-0 z-10">
          <TopBar back="/eventos" className="bg-transparent text-white [&_svg]:text-white" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-7 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Badge tone="neutral" className="bg-white/20 text-white backdrop-blur-sm">
              {typeLabel[event.type]}
              {event.editionNumber ? ` · ${event.editionNumber}º` : ''}
            </Badge>
            {open && (
              <Badge
                tone="accent"
                className="bg-(color:--color-accent) text-(color:--color-accent-foreground)"
              >
                inscrições abertas
              </Badge>
            )}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-[clamp(2.4rem,11vw,3.4rem)] leading-[0.95] tracking-[-0.025em] text-balance max-w-[16ch]"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            {event.name}
          </motion.h1>
          {lead && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display-italic text-lg mt-2 opacity-90 max-w-[28ch]"
            >
              {lead}
            </motion.p>
          )}
        </div>
      </div>

      <div className="px-5 -mt-3 relative">
        <div className="surface-warmth rounded-(--radius-lg) border border-(color:--color-border) p-5 grid gap-4 mb-6">
          <Meta
            icon={<Calendar className="size-4" strokeWidth={1.5} />}
            label="Quando"
            value={formatDateRange(event.startDate, event.endDate)}
          />
          {event.location && (
            <Meta
              icon={<MapPin className="size-4" strokeWidth={1.5} />}
              label="Onde"
              value={event.location}
            />
          )}
          {event.registrationDeadline && (
            <Meta
              icon={<Clock className="size-4" strokeWidth={1.5} />}
              label="Inscrições até"
              value={new Date(event.registrationDeadline).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
              })}
            />
          )}
        </div>

        {body && (
          <div className="prose-like">
            {body.split(/\n{2,}/).map((paragraph, i) => (
              <p
                key={i}
                className={cn(
                  'font-sans text-[16px] leading-relaxed text-(color:--color-foreground) text-pretty',
                  i === 0 && 'drop-cap',
                  i > 0 && 'mt-4',
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {(body || lead) && <Separator variant="ornament" className="my-8" />}

        {(event.priceCampista || event.priceEquipista) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {event.priceCampista !== null && (
              <PriceBlock label="Campista" value={Number(event.priceCampista)} />
            )}
            {event.priceEquipista !== null && (
              <PriceBlock label="Equipista" value={Number(event.priceEquipista)} />
            )}
          </div>
        )}

        {event.allowFirstTimer && (
          <div className="rounded-(--radius-md) border border-(color:--color-accent)/30 bg-(color:--color-accent-soft) p-4 mb-6 flex gap-3">
            <ArchGlyph className="size-5 text-(color:--color-accent) shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[14px] text-(color:--color-accent-foreground)">
                Primeira vez?
              </p>
              <p className="text-[13px] text-(color:--color-accent-foreground)/80 mt-0.5 leading-relaxed">
                Este é um dos eventos onde campistas vivem o Santa Rita pela primeira vez.
                Vai ser a sua estreia.
              </p>
            </div>
          </div>
        )}

        <div className="pb-32" />
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-20 px-5 pt-3 pb-2 bg-gradient-to-t from-(color:--color-background) via-(color:--color-background)/90 to-transparent">
          <Button asChild block size="lg">
            <Link to="/eventos/$slug/inscricao" params={{ slug: event.slug }}>
              Quero me inscrever
            </Link>
          </Button>
        </div>
      )}
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
        <p className="text-[15px] text-(color:--color-foreground) mt-0.5 leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

function PriceBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
        {label}
      </p>
      <p
        className="font-display text-2xl mt-1 tracking-tight"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
      >
        {value === 0 ? 'Sem custo' : brl(value)}
      </p>
    </div>
  );
}
