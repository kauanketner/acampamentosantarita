import { Link, createFileRoute } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Logo } from '@/components/motif/Logo';
import { Page } from '@/components/shell/Page';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <Page withBottomNav={false} className="flex flex-col scene-vignette">
      {/* Logo + título — momento de identidade */}
      <div className="relative flex-1 min-h-[42vh] flex flex-col items-center justify-end pb-3 px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0.32, 1] }}
        >
          <Logo size="xl" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center px-6 pb-8"
      >
        <h1
          className="font-display text-[clamp(2rem,9vw,2.6rem)] leading-[0.98] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Volte
          <br />
          <span className="font-display-italic text-(color:--color-primary)">ao silêncio.</span>
        </h1>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="px-6 pb-10"
      >
        <form className="space-y-4 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
          <Field label={<Label htmlFor="email">E-mail</Label>}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              inputMode="email"
            />
          </Field>
          <Field
            label={
              <div className="flex items-baseline justify-between">
                <Label htmlFor="password" className="mb-0">
                  Senha
                </Label>
                <Link
                  to="/login"
                  className="text-xs font-normal text-(color:--color-muted-foreground) hover:text-(color:--color-primary) transition"
                >
                  Esqueci
                </Link>
              </div>
            }
          >
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-9 inline-flex items-center justify-center rounded-full text-(color:--color-muted-foreground) hover:text-(color:--color-foreground) hover:bg-(color:--color-muted) transition"
                aria-label={showPwd ? 'Esconder senha' : 'Mostrar senha'}
              >
                {showPwd ? (
                  <EyeOff className="size-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </Field>

          <Button asChild block size="lg" className="mt-2">
            <Link to="/">Entrar</Link>
          </Button>

          <div className="flex items-center gap-3 py-3">
            <div className="h-px flex-1 bg-(color:--color-border)" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-subtle)">
              ou
            </span>
            <div className="h-px flex-1 bg-(color:--color-border)" />
          </div>

          <Button asChild variant="outline" block size="lg">
            <Link to="/cadastro">Primeiro acesso</Link>
          </Button>
        </form>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-subtle) text-center mt-8">
          Caieiras · São Paulo
        </p>
      </motion.div>
    </Page>
  );
}
