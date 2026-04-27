import { Link, createFileRoute } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ArchMotif } from '@/components/motif/arch';
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
      {/* Top — arco contemplativo */}
      <div className="relative flex-1 min-h-[42vh] flex items-end justify-center pb-2 px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0.32, 1] }}
          className="relative"
        >
          <ArchMotif
            className="w-32 h-44 text-(color:--color-primary)/30"
            withInner
          />
          {/* tiny title positioned above arch keystone */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) whitespace-nowrap"
          >
            comunidade Santa Rita
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="text-center px-6 pb-8"
      >
        <h1
          className="font-display text-[clamp(2.4rem,11vw,3.4rem)] leading-[0.95] tracking-[-0.025em]"
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
        transition={{ delay: 0.45, duration: 0.6 }}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="mb-0">
                  Senha
                </Label>
                <Link
                  to="/login"
                  className="text-xs text-(color:--color-muted-foreground) hover:text-(color:--color-primary) transition"
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
      </motion.div>
    </Page>
  );
}
