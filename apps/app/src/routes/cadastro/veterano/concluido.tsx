import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { useRegisterVeteran } from '@/lib/auth';
import { buildSignupPayload, useCadastroStore } from '@/lib/cadastro-store';
import { maskPhoneDisplay } from '@/lib/format';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Loader2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export const Route = createFileRoute('/cadastro/veterano/concluido')({
  component: Concluido,
});

function Concluido() {
  const navigate = useNavigate();
  const register = useRegisterVeteran();
  const cadastroState = useCadastroStore();
  const reset = useCadastroStore((s) => s.reset);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const phoneRaw = cadastroState.phone;
  const phoneNice = maskPhoneDisplay(phoneRaw);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = buildSignupPayload(cadastroState);

    try {
      const result = await register.mutateAsync(payload);
      reset();
      navigate({
        to: '/codigo',
        search: { phone: phoneRaw, masked: result.phoneMasked, from: 'cadastro' },
      });
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiError) setError(err.message);
      else setError('Não foi possível concluir o cadastro. Tente de novo.');
    }
  };

  return (
    <Page withBottomNav={false} className="flex flex-col">
      <TopBar back="/cadastro/veterano/passo-6" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="size-16 rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) inline-flex items-center justify-center mb-6"
        >
          <MessageSquare className="size-7" strokeWidth={1.5} />
        </motion.div>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) mb-3">
          Última etapa
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance text-center"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Vamos confirmar seu <span className="font-display-italic">WhatsApp</span>.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-(color:--color-muted-foreground) text-center max-w-sm text-pretty">
          Mandamos um código de 6 dígitos para
        </p>
        <p
          className="font-display text-xl mt-2 tabular-nums"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
        >
          {phoneNice}
        </p>
        <p className="mt-1 text-xs text-(color:--color-muted-foreground)">
          Toda vez que entrar, é assim — sem senha.
        </p>
      </div>

      {error && (
        <p className="px-6 text-sm text-(color:--color-destructive) text-center mb-2">{error}</p>
      )}

      <form onSubmit={onSubmit}>
        <div className="fixed inset-x-0 bottom-0 z-30 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-(color:--color-background)/85 backdrop-blur-md border-t border-(color:--color-border)">
          <Button type="submit" block size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Enviando código…
              </>
            ) : (
              'Receber código no WhatsApp'
            )}
          </Button>
        </div>
      </form>
    </Page>
  );
}
