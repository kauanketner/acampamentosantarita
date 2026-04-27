import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Logo } from '@/components/motif/Logo';
import { Page } from '@/components/shell/Page';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/form/Field';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/ui/masked-input';
import { ApiError } from '@/lib/api';
import { useRequestCode } from '@/lib/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const requestCode = useRequestCode();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await requestCode.mutateAsync({ phone });
      if (result.exists) {
        // Usuário existente → tela de código (já enviado)
        navigate({
          to: '/codigo',
          search: { phone, masked: result.phoneMasked, from: 'login' },
        });
      } else {
        // Telefone novo → cadastro com phone pré-preenchido
        navigate({
          to: '/cadastro',
          search: { phone },
        });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Não foi possível continuar. Tente de novo.');
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

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center px-6 pb-6"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) mb-3">
          Comunidade Santa Rita
        </p>
        <h1
          className="font-display text-[clamp(1.5rem,7vw,2rem)] leading-[1.1] tracking-[-0.022em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Comece pelo seu <span className="font-display-italic">WhatsApp</span>.
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="px-6 pb-10"
      >
        <form className="space-y-4 max-w-sm mx-auto" onSubmit={onSubmit}>
          <Field
            label={<Label htmlFor="phone">Telefone</Label>}
            hint="Se já tem conta, mandamos o código. Se for primeira vez, criamos seu cadastro."
          >
            <MaskedInput
              id="phone"
              mask="phone"
              value={phone}
              onValueChange={(_f, raw) => setPhone(raw)}
              autoFocus
            />
          </Field>

          {error && (
            <p className="text-sm text-(color:--color-destructive) text-center">{error}</p>
          )}

          <Button
            type="submit"
            block
            size="lg"
            disabled={requestCode.isPending || phone.length < 10}
            className="mt-2"
          >
            {requestCode.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Continuando…
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </form>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-subtle) text-center mt-10">
          Caieiras · São Paulo
        </p>
      </motion.div>
    </Page>
  );
}
