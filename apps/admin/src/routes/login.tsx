import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { Logomark } from '@/components/ui/Logo';
import { ApiError } from '@/lib/api';
import { isAdminRole, useLogout, useRequestCode, useSession, useVerifyCode } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { maskPhoneDisplay, maskPhoneInput } from '@/lib/format';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

type Step = 'phone' | 'code';

function LoginPage() {
  const navigate = useNavigate();
  const { data: session, isLoading: loadingSession } = useSession();
  const requestCode = useRequestCode();
  const verifyCode = useVerifyCode();
  const logout = useLogout();

  const [step, setStep] = useState<Step>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [phoneMasked, setPhoneMasked] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (loadingSession) return;
    if (!session) return;
    if (isAdminRole(session.user.role)) {
      navigate({ to: '/', replace: true });
    } else {
      setForbidden(true);
    }
  }, [session, loadingSession, navigate]);

  const onRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phoneRaw.length < 10) {
      setError('Digite um celular válido.');
      return;
    }
    try {
      const res = await requestCode.mutateAsync({ phone: phoneRaw });
      if (!res.exists) {
        setError('Não há cadastro com este número. Peça pra coordenação te dar acesso.');
        return;
      }
      setPhoneMasked(res.phoneMasked);
      setStep('code');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não conseguimos enviar o código.');
    }
  };

  const onVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.length !== 6) {
      setError('O código tem 6 dígitos.');
      return;
    }
    try {
      const res = await verifyCode.mutateAsync({ phone: phoneRaw, code });
      if (!isAdminRole(res.user.role)) {
        await logout.mutateAsync();
        setForbidden(true);
        setStep('phone');
        return;
      }
      navigate({ to: '/', replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Código inválido.');
    }
  };

  return (
    <Shell>
      <BrandPanel />
      <FormPanel>
        {forbidden ? (
          <ForbiddenView
            onRetry={() => {
              setForbidden(false);
              setPhoneInput('');
              setPhoneRaw('');
              setCode('');
            }}
          />
        ) : step === 'phone' ? (
          <form onSubmit={onRequestCode} className="space-y-5">
            <header className="space-y-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                Acesso · Coordenação
              </p>
              <h1
                className="font-display text-3xl tracking-tight leading-[1.05]"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
              >
                Bem-vindo de volta.
              </h1>
              <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed pt-1">
                Digite seu celular pra receber o código no WhatsApp.
              </p>
            </header>

            <Field label="Celular">
              <Input
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                autoFocus
                placeholder="(11) 99999-0000"
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(maskPhoneInput(e.target.value));
                  setPhoneRaw(e.target.value.replace(/\D/g, '').slice(0, 11));
                }}
              />
            </Field>

            {error && <ErrorBlock>{error}</ErrorBlock>}

            <Button
              type="submit"
              size="lg"
              block
              disabled={requestCode.isPending || phoneRaw.length < 10}
            >
              {requestCode.isPending ? 'Enviando…' : 'Enviar código'}
            </Button>

            <p className="text-[11px] text-(color:--color-muted-foreground) text-center leading-relaxed pt-1">
              Acesso restrito a coordenação, tesouraria e equipes.
              <br />
              Se precisar de acesso, fale com o admin.
            </p>
          </form>
        ) : (
          <form onSubmit={onVerifyCode} className="space-y-5">
            <header className="space-y-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                Verificação
              </p>
              <h1
                className="font-display text-3xl tracking-tight leading-[1.05]"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
              >
                Confirme o código.
              </h1>
              <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed pt-1">
                Mandamos 6 dígitos pro seu WhatsApp{' '}
                <span className="font-mono text-(color:--color-foreground)">
                  {phoneMasked || maskPhoneDisplay(phoneRaw)}
                </span>
                .
              </p>
            </header>

            <Field label="Código">
              <input
                type="text"
                autoComplete="one-time-code"
                inputMode="numeric"
                autoFocus
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={cn(
                  'w-full rounded-(--radius-md)',
                  'border border-(color:--color-border-strong) bg-(color:--color-surface)',
                  'px-3 py-3 text-center font-mono text-2xl tracking-[0.5em] tabular-nums',
                  'outline-none transition-shadow duration-150',
                  'focus-visible:ring-2 focus-visible:ring-(color:--color-primary)/35 focus-visible:border-(color:--color-primary)',
                )}
              />
            </Field>

            {error && <ErrorBlock>{error}</ErrorBlock>}

            <div className="space-y-2.5">
              <Button
                type="submit"
                size="lg"
                block
                disabled={verifyCode.isPending || code.length !== 6}
              >
                {verifyCode.isPending ? 'Verificando…' : 'Entrar'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setCode('');
                  setError(null);
                }}
                className="w-full text-xs text-(color:--color-muted-foreground) hover:text-(color:--color-foreground) underline underline-offset-2"
              >
                Trocar número
              </button>
            </div>
          </form>
        )}
      </FormPanel>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-(color:--color-background) text-(color:--color-foreground)">
      <div className="grid lg:grid-cols-2 min-h-screen">{children}</div>
    </div>
  );
}

function BrandPanel() {
  return (
    <aside
      className={cn(
        'relative hidden lg:flex flex-col justify-between p-12 overflow-hidden',
        'bg-(color:--color-primary) text-(color:--color-primary-foreground)',
      )}
    >
      {/* Texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '14px 14px',
        }}
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 size-[420px] rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-20 size-[360px] rounded-full bg-black/15 blur-3xl"
      />

      <div className="relative">
        <div className="inline-flex items-center gap-3">
          <Logomark />
          <div>
            <p
              className="font-display text-xl leading-none tracking-tight"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
            >
              Santa Rita
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] mt-1.5 font-mono text-white/70">
              Painel administrativo
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-md space-y-6">
        <p
          className="font-display italic text-4xl leading-[1.1] tracking-tight"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
        >
          “Cada nome é uma alma. Cada inscrição, um passo.”
        </p>
        <div aria-hidden className="flex items-center gap-3 text-white/60">
          <span className="h-px w-12 bg-current" />
          <svg viewBox="0 0 12 12" className="size-2.5" fill="currentColor" aria-hidden>
            <circle cx="6" cy="6" r="1.5" />
          </svg>
          <span className="h-px flex-1 bg-current" />
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          O painel onde a coordenação cuida das inscrições, das tribos, das equipes e do financeiro
          — com calma, com rito, com cuidado.
        </p>
      </div>

      <div className="relative flex items-baseline justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-white/60">
        <span>v0.1 — Comunidade</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </aside>
  );
}

function FormPanel({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center px-6 py-14 lg:px-16">
      <div className="w-full max-w-sm">
        {/* Mobile brand */}
        <div className="lg:hidden mb-10 flex items-center gap-2.5">
          <span className="text-(color:--color-primary)">
            <Logomark />
          </span>
          <span>
            <p
              className="font-display text-[17px] leading-none tracking-tight"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
            >
              Santa Rita
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mt-1.5 font-mono">
              Painel administrativo
            </p>
          </span>
        </div>
        {children}
      </div>
    </main>
  );
}

function ForbiddenView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-5">
      <header className="space-y-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-danger)">
          Acesso restrito
        </p>
        <h1
          className="font-display text-3xl tracking-tight leading-[1.05]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
        >
          Esta conta não tem painel.
        </h1>
      </header>
      <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) p-4 text-sm text-(color:--color-danger) leading-relaxed">
        Esta conta é de participante. Pra entrar no painel, peça pra coordenação atualizar sua
        função.
      </div>
      <Button variant="secondary" block onClick={onRetry}>
        Tentar com outro número
      </Button>
    </div>
  );
}

function ErrorBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-(--radius-md) border border-(color:--color-danger)/40 bg-(color:--color-danger-soft) px-3 py-2.5 text-sm text-(color:--color-danger)">
      {children}
    </div>
  );
}
