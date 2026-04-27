import { Link, createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArchMotif } from '@/components/motif/arch';
import { Logo } from '@/components/motif/Logo';
import { Page } from '@/components/shell/Page';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/cadastro/primeira-vez/concluido')({
  component: Concluido,
});

function Concluido() {
  return (
    <Page withBottomNav={false} className="flex flex-col scene-vignette">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative"
        >
          <ArchMotif className="w-44 h-60 text-(color:--color-primary)/20" withInner />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.6 }}
            className="absolute inset-0"
          >
            <ArchMotif className="w-44 h-60 text-(color:--color-accent)/70" withInner={false} />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) mt-10 mb-4"
        >
          Recebemos seu cadastro
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-display text-[clamp(2.3rem,11vw,3rem)] leading-[1] tracking-[-0.025em] text-balance text-center"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Pronto.
          <br />
          <span className="font-display-italic text-(color:--color-primary)">
            Bem-vinda à comunidade.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 max-w-xs text-center text-[15px] leading-relaxed text-(color:--color-muted-foreground)"
        >
          Você já pode explorar os próximos eventos. Se inscrever fica para quando o
          coração indicar.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="flex justify-center mt-6"
      >
        <Logo size="sm" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="px-6 pb-12 pt-6"
      >
        <Button asChild block size="lg">
          <Link to="/">Continuar</Link>
        </Button>
      </motion.div>
    </Page>
  );
}
