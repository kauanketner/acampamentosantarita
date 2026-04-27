import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArchMotif } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { myTribe } from '@/mock/data';

export const Route = createFileRoute('/_auth/tribo/')({
  component: TriboPage,
});

function TriboPage() {
  if (!myTribe.isRevealed) {
    return <PreReveal />;
  }
  return <Revealed />;
}

function PreReveal() {
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
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="px-6 pb-10 text-center"
      >
        <p className="font-display-italic text-sm text-(color:--color-subtle)">
          Viva seu momento.
        </p>
      </motion.div>
    </Page>
  );
}

function Revealed() {
  return (
    <Page>
      <TopBar title="Sua tribo" border />

      <div className="px-5 pt-4 pb-3">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color: myTribe.color }}
        >
          Revelada
        </p>
        <h1
          className="font-display text-[clamp(2.2rem,10vw,3rem)] leading-[1] tracking-[-0.025em] text-balance"
          style={{
            fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            color: myTribe.color,
          }}
        >
          {myTribe.name}
        </h1>
        <p className="font-display-italic text-lg mt-2 text-(color:--color-muted-foreground)">
          {myTribe.motto}
        </p>
      </div>

      <div className="px-5 mt-2">
        <div
          className="rounded-(--radius-lg) h-44 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(135deg, ${myTribe.color}, oklch(0.78 0.075 70))`,
          }}
        >
          <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-noise" />
          <ArchMotif
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-44 text-white/20"
            withInner
          />
        </div>
      </div>

      <div className="px-5 mt-6 pb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-4">
          Quem caminhou com você
        </p>
        <ul className="grid gap-2.5">
          {myTribe.members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 p-3 rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface)"
            >
              <Avatar name={m.name} size="md" ringed={m.role !== 'campista'} />
              <div className="min-w-0">
                <p className="text-[15px] font-medium leading-tight">{m.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-muted-foreground) mt-0.5">
                  {m.role === 'lider' ? 'líder' : m.role === 'vice_lider' ? 'vice-líder' : 'campista'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
}
