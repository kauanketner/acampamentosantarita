import { Link, createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Logo } from '@/components/motif/Logo';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { useCadastroStore } from '@/lib/cadastro-store';

export const Route = createFileRoute('/cadastro/')({
  component: CadastroEscolha,
});

function CadastroEscolha() {
  const reset = useCadastroStore((s) => s.reset);
  const setVariant = useCadastroStore((s) => s.setVariant);

  // Limpa qualquer rascunho anterior quando o usuário entra na escolha
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <Page withBottomNav={false} className="flex flex-col">
      <TopBar back="/login" />

      <div className="px-6 pt-6 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-3">
          Antes de começar
        </p>
        <h1
          className="font-display text-[clamp(2.2rem,9vw,2.8rem)] leading-[1] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          É a sua primeira <span className="font-display-italic">vez</span> aqui?
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-(color:--color-muted-foreground) text-pretty">
          A resposta muda como te recebemos. Quem volta tem mais um passo —
          contar de quais acampamentos já participou.
        </p>
      </div>

      <div className="px-6 pt-8 pb-10 grid gap-3">
        <ChoiceCard
          to="/cadastro/primeira-vez/passo-1"
          eyebrow="Primeira vez"
          title="Estou chegando"
          description="Cinco passos. Cuidamos do que importa para você viver bem o evento."
          accent="primary"
          delay={0.05}
          onSelect={() => setVariant('primeira-vez')}
        />
        <ChoiceCard
          to="/cadastro/veterano/passo-1"
          eyebrow="Veterano"
          title="Já estive aqui"
          description="Seis passos. No último, você conta de quais acampamentos participou — pra preservar a memória da comunidade."
          accent="accent"
          delay={0.15}
          onSelect={() => setVariant('veterano')}
        />
      </div>

      <div className="px-6 pb-10 mt-auto flex flex-col items-center gap-3">
        <Logo size="sm" />
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-subtle)">
          Caieiras · SP
        </p>
      </div>
    </Page>
  );
}

function ChoiceCard({
  to,
  eyebrow,
  title,
  description,
  accent,
  delay,
  onSelect,
}: {
  to: '/cadastro/primeira-vez/passo-1' | '/cadastro/veterano/passo-1';
  eyebrow: string;
  title: string;
  description: string;
  accent: 'primary' | 'accent';
  delay: number;
  onSelect?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        to={to}
        onClick={() => onSelect?.()}
        className="group relative block surface-warmth rounded-(--radius-lg) border border-(color:--color-border) px-5 py-5 active:scale-[0.99] transition-transform"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(color:--color-muted-foreground) mb-1.5">
          {eyebrow}
        </p>
        <h2
          className={
            accent === 'primary'
              ? 'font-display text-2xl tracking-tight text-(color:--color-primary)'
              : 'font-display text-2xl tracking-tight text-(color:--color-foreground)'
          }
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-(color:--color-muted-foreground) text-pretty pr-2">
          {description}
        </p>
        {/* trailing arrow indicator */}
        <span
          aria-hidden
          className="absolute right-5 top-5 size-7 rounded-full inline-flex items-center justify-center text-(color:--color-muted-foreground) group-hover:text-(color:--color-primary) group-hover:translate-x-0.5 transition"
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}
