import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ArchMotif } from '@/components/motif/arch';
import { Logo } from '@/components/motif/Logo';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError, apiUpload } from '@/lib/api';
import { useRegisterFirstTimer } from '@/lib/auth';
import { buildSignupPayload, useCadastroStore } from '@/lib/cadastro-store';

export const Route = createFileRoute('/cadastro/primeira-vez/concluido')({
  component: Concluido,
});

function Concluido() {
  const navigate = useNavigate();
  const register = useRegisterFirstTimer();
  const cadastroState = useCadastroStore();
  const reset = useCadastroStore((s) => s.reset);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cadastroState.fullName) {
      setError('O nome é obrigatório. Volte ao passo 1.');
      return;
    }
    if (cadastroState.emergencyContacts.filter((c) => c.name && c.phone).length < 2) {
      setError('Inclua pelo menos 2 contatos de emergência (passo 3).');
      return;
    }

    const payload = buildSignupPayload(cadastroState, email, password);

    try {
      await register.mutateAsync(payload);

      // Upload do avatar (se houver) — depois da sessão criada
      if (cadastroState.avatarFile) {
        try {
          await apiUpload<{ avatarUrl: string }>(
            '/v1/persons/me/avatar',
            cadastroState.avatarFile,
          );
        } catch {
          // Não bloqueia o cadastro se o avatar falhar — usuário pode tentar de novo no perfil
        }
      }

      reset();
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Não foi possível concluir o cadastro. Tente de novo.');
      }
    }
  };

  if (done) {
    return <Welcome />;
  }

  return (
    <Page withBottomNav={false} className="flex flex-col">
      <TopBar back="/cadastro/primeira-vez/passo-5" />
      <div className="px-5 pt-2 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          Quase lá
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Crie seu <span className="font-display-italic">acesso</span>.
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-(color:--color-muted-foreground)">
          E-mail e senha para entrar a partir de agora.
        </p>
      </div>

      <form onSubmit={onSubmit} className="px-5 grid gap-4 pb-32">
        <Field label={<Label htmlFor="email">E-mail</Label>}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </Field>
        <Field
          label={<Label htmlFor="password">Senha</Label>}
          hint="Mínimo de 6 caracteres."
        >
          <div className="relative">
            <Input
              id="password"
              type={showPwd ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
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

        {error && (
          <p className="text-sm text-(color:--color-destructive) text-center">{error}</p>
        )}

        <div
          className="fixed inset-x-0 bottom-0 z-30 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-(color:--color-background)/85 backdrop-blur-md border-t border-(color:--color-border)"
        >
          <Button type="submit" block size="lg" disabled={register.isPending}>
            {register.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Concluindo…
              </>
            ) : (
              'Concluir cadastro'
            )}
          </Button>
        </div>
      </form>
    </Page>
  );
}

function Welcome() {
  const navigate = useNavigate();
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
        <Button block size="lg" onClick={() => navigate({ to: '/' })}>
          Continuar
        </Button>
      </motion.div>
    </Page>
  );
}
