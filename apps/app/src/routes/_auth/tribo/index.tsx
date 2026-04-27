import { Link, createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ArchMotif } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDateRange } from '@/lib/format';
import {
  type CurrentTribePending,
  type CurrentTribeRevealed,
  useCurrentTribe,
} from '@/lib/queries/tribes';
import { mediaUrl } from '@/lib/queries/profile';

export const Route = createFileRoute('/_auth/tribo/')({
  component: TriboPage,
});

function TriboPage() {
  const { data, isLoading, isError } = useCurrentTribe();

  if (isLoading) {
    return (
      <Page>
        <div className="safe-top" />
        <TopBar title="Tribo" border={false} />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <div className="safe-top" />
        <TopBar title="Tribo" border={false} />
        <div className="px-6 py-16 text-center">
          <p className="font-display text-2xl">Não conseguimos buscar agora.</p>
          <p className="text-sm text-(color:--color-muted-foreground) mt-2">
            Tente daqui a pouco.
          </p>
        </div>
      </Page>
    );
  }

  if (!data) return <NoTribe />;
  if (!data.revealed) return <PreReveal data={data} />;
  return <Revealed data={data} />;
}

function NoTribe() {
  return (
    <Page className="flex flex-col scene-vignette">
      <div className="safe-top" />
      <TopBar title="Tribo" border={false} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.32, 0.72, 0.32, 1] }}
        >
          <ArchMotif className="w-32 h-44 text-(color:--color-mystery)/30" withInner />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="mt-10 text-center max-w-sm"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) mb-4">
            Nenhuma tribo ainda
          </p>
          <h1
            className="font-display text-[clamp(2rem,9vw,2.6rem)] leading-[1.05] tracking-[-0.025em] text-balance"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            Sua tribo
            <br />
            <span className="font-display-italic">aparece aqui.</span>
          </h1>
          <Separator variant="ornament" className="my-8" />
          <p className="text-[15px] leading-relaxed text-(color:--color-muted-foreground) text-pretty">
            Ainda não há um acampamento com tribo definida pra você. Quando estiver inscrito
            num acampamento e a coordenação revelar, ela mora aqui.
          </p>
          <Button asChild variant="ghost" size="md" className="mt-6">
            <Link to="/eventos">Ver acampamentos</Link>
          </Button>
        </motion.div>
      </div>
    </Page>
  );
}

function PreReveal({ data }: { data: CurrentTribePending }) {
  return (
    <Page className="flex flex-col scene-vignette">
      <div className="safe-top" />
      <TopBar title="Tribo" border={false} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.32, 0.72, 0.32, 1] }}
        >
          <ArchMotif className="w-32 h-44 text-(color:--color-mystery)/30" withInner />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="mt-10 text-center max-w-sm"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) mb-4">
            Ainda em silêncio
          </p>
          <h1
            className="font-display text-[clamp(2rem,9vw,2.6rem)] leading-[1.05] tracking-[-0.025em] text-balance"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            Ao final do evento,
            <br />
            <span className="font-display-italic">você descobrirá.</span>
          </h1>
          <Separator variant="ornament" className="my-8" />
          <p className="text-[15px] leading-relaxed text-(color:--color-muted-foreground) text-pretty">
            A tribo é parte do que se vive lá dentro. Aqui, ela espera. Quando o tempo
            certo chegar, ela aparece.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-subtle)">
            {data.event.name} · {formatDateRange(data.event.startDate, data.event.endDate)}
          </p>
        </motion.div>
      </div>
    </Page>
  );
}

function Revealed({ data }: { data: CurrentTribeRevealed }) {
  const color = data.tribe.color ?? 'var(--color-primary)';
  const photo = mediaUrl(data.tribe.photoUrl);

  return (
    <Page>
      <TopBar title="Sua tribo" border />

      <div className="px-5 pt-4 pb-3">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color }}
        >
          Revelada · {data.event.name}
        </p>
        <h1
          className="font-display text-[clamp(2.2rem,10vw,3rem)] leading-[1] tracking-[-0.025em] text-balance"
          style={{
            fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            color,
          }}
        >
          {data.tribe.name}
        </h1>
        {data.tribe.motto && (
          <p className="font-display-italic text-lg mt-2 text-(color:--color-muted-foreground)">
            {data.tribe.motto}
          </p>
        )}
      </div>

      <div className="px-5 mt-2">
        <div
          className="rounded-(--radius-lg) h-44 relative overflow-hidden"
          style={
            photo
              ? {
                  backgroundImage: `url("${photo}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {
                  backgroundImage: `linear-gradient(135deg, ${color}, oklch(0.78 0.075 70))`,
                }
          }
        >
          <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-noise" />
          <ArchMotif
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-44 text-white/20"
            withInner
          />
        </div>
        {data.tribe.description && (
          <p className="text-[15px] leading-relaxed text-(color:--color-muted-foreground) mt-4 text-pretty">
            {data.tribe.description}
          </p>
        )}
      </div>

      <div className="px-5 mt-6 pb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-4">
          Quem caminhou com você
        </p>
        {data.members.length === 0 ? (
          <p className="text-sm text-(color:--color-muted-foreground)">
            A coordenação ainda não liberou os outros membros.
          </p>
        ) : (
          <ul className="grid gap-2.5">
            {data.members.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface)"
              >
                <Avatar
                  src={mediaUrl(m.person.avatarUrl)}
                  name={m.person.fullName}
                  size="md"
                  ringed={m.role !== 'campista'}
                />
                <div className="min-w-0">
                  <p className="text-[15px] font-medium leading-tight">
                    {m.person.fullName}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-muted-foreground) mt-0.5">
                    {m.role === 'lider'
                      ? 'líder'
                      : m.role === 'vice_lider'
                        ? 'vice-líder'
                        : 'campista'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  );
}
