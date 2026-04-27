import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Logo } from '@/components/motif/Logo';
import { Page } from '@/components/shell/Page';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';
import { useLogin } from '@/lib/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login.mutateAsync({ email, password });
      navigate({ to: '/' });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Não foi possível entrar. Tente de novo.');
      }
    }
  };

  return (
    <Page withBottomNav={false} className="flex flex-col scene-vignette">
      <div className="relative flex-1 min-h-[36vh] flex flex-col items-center justify-end pb-3 px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0.32, 1] }}
        >
          <Logo size="xl" />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) text-center pb-10"
      >
        Entrar na comunidade
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="px-6 pb-10"
      >
        <form className="space-y-4 max-w-sm mx-auto" onSubmit={onSubmit}>
          <Field label={<Label htmlFor="email">E-mail</Label>}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          {error && (
            <p className="text-sm text-(color:--color-destructive) text-center">{error}</p>
          )}

          <Button type="submit" block size="lg" disabled={login.isPending} className="mt-2">
            {login.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Entrando…
              </>
            ) : (
              'Entrar'
            )}
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
