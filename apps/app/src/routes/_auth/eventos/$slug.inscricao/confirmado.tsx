import { Link, createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArchMotif } from '@/components/motif/arch';
import { Page } from '@/components/shell/Page';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_auth/eventos/$slug/inscricao/confirmado')({
  component: InscricaoConfirmado,
});

function InscricaoConfirmado() {
  return (
    <Page withBottomNav={false} className="flex flex-col scene-vignette">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ArchMotif className="w-32 h-44 text-(color:--color-primary)/35" withInner />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) mt-8 mb-3"
        >
          Inscrição recebida
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-display text-[clamp(2rem,10vw,2.8rem)] leading-[1] tracking-[-0.025em] text-balance text-center"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Te <span className="font-display-italic text-(color:--color-primary)">esperamos.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-6 max-w-sm text-center text-[15px] leading-relaxed text-(color:--color-muted-foreground)"
        >
          A coordenação confirma sua presença em até 3 dias. Avisamos por aqui e por
          e-mail.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="px-6 pb-12 pt-4 grid gap-2.5"
      >
        <Button asChild block size="lg">
          <Link to="/minhas-inscricoes">Minhas inscrições</Link>
        </Button>
        <Button asChild block size="lg" variant="ghost">
          <Link to="/">Voltar para o início</Link>
        </Button>
      </motion.div>
    </Page>
  );
}
