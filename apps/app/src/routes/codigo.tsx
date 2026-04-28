import { Logo } from '@/components/motif/Logo';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { useRequestCode, useVerifyCode } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Loader2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

const searchSchema = z.object({
  phone: z.string(),
  masked: z.string().optional(),
  from: z.enum(['cadastro', 'login']).optional().default('login'),
});

export const Route = createFileRoute('/codigo')({
  validateSearch: (search) => searchSchema.parse(search),
  component: CodigoPage,
});

function CodigoPage() {
  const navigate = useNavigate();
  const { phone, masked, from } = Route.useSearch();
  const verify = useVerifyCode();
  const requestCode = useRequestCode();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(30);

  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const _code = digits.join('');

  const setAt = (idx: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[idx] = clean;
    setDigits(next);
    if (clean && idx < 5) {
      refs.current[idx + 1]?.focus();
    }
    // auto-submit quando preencheu
    if (clean && idx === 5) {
      submit(next.join(''));
    }
  };

  const handleKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const next = Array(6).fill('');
    for (let i = 0; i < text.length; i++) next[i] = text[i]!;
    setDigits(next);
    if (text.length === 6) submit(text);
    else refs.current[Math.min(text.length, 5)]?.focus();
  };

  const submit = async (full: string) => {
    if (full.length !== 6) return;
    setError(null);
    try {
      await verify.mutateAsync({ phone, code: full });
      navigate({ to: '/' });
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Código inválido. Tente de novo.');
      setDigits(Array(6).fill(''));
      refs.current[0]?.focus();
    }
  };

  const resend = async () => {
    if (resendIn > 0) return;
    setError(null);
    try {
      await requestCode.mutateAsync({ phone });
      setResendIn(30);
      setDigits(Array(6).fill(''));
      refs.current[0]?.focus();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    }
  };

  return (
    <Page withBottomNav={false} className="flex flex-col">
      <TopBar back={from === 'cadastro' ? false : '/login'} />

      <div className="flex-1 flex flex-col px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center pt-4 pb-6"
        >
          <div className="size-16 rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) inline-flex items-center justify-center mb-5">
            <MessageSquare className="size-7" strokeWidth={1.5} />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) mb-2">
            Código enviado
          </p>
          <h1
            className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance text-center"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            Veja seu <span className="font-display-italic">WhatsApp</span>.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-(color:--color-muted-foreground) text-center max-w-xs text-pretty">
            Mandamos um código de 6 dígitos para
            <br />
            <span className="font-medium text-(color:--color-foreground) font-mono text-[14px]">
              {masked ?? phone}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-6 gap-2 max-w-sm mx-auto w-full"
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={cn(
                'aspect-square w-full text-center text-2xl font-display font-medium tabular-nums',
                'rounded-(--radius-md) border-2 bg-(color:--color-surface)',
                'border-(color:--color-border-strong)',
                'focus:outline-none focus:border-(color:--color-primary) focus:ring-2 focus:ring-(color:--color-ring)',
                'transition',
                d && 'border-(color:--color-primary)',
              )}
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
            />
          ))}
        </motion.div>

        {error && (
          <p className="text-sm text-(color:--color-destructive) text-center mt-5">{error}</p>
        )}

        {verify.isPending && (
          <p className="text-sm text-(color:--color-muted-foreground) text-center mt-5 inline-flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Validando…
          </p>
        )}

        <div className="mt-auto pb-12 pt-10 text-center">
          {resendIn > 0 ? (
            <p className="text-sm text-(color:--color-muted-foreground)">
              Não recebeu? Você pode pedir um novo em{' '}
              <span className="tabular-nums font-medium">{resendIn}s</span>
            </p>
          ) : (
            <Button
              variant="link"
              onClick={resend}
              disabled={requestCode.isPending}
              className="text-sm"
            >
              Enviar outro código
            </Button>
          )}
          <div className="mt-6 flex justify-center text-(color:--color-subtle)">
            <Logo size="xs" />
          </div>
        </div>
      </div>
    </Page>
  );
}
