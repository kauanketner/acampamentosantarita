import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ApiError } from '@/lib/api';
import {
  isAdminRole,
  useLogout,
  useRequestCode,
  useSession,
  useVerifyCode,
} from '@/lib/auth';
import { maskPhoneDisplay, maskPhoneInput } from '@/lib/format';

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
        setError(
          'Não há cadastro com este número. Peça pra coordenação te dar acesso.',
        );
        return;
      }
      setPhoneMasked(res.phoneMasked);
      setStep('code');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não conseguimos enviar o código.',
      );
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

  if (forbidden) {
    return (
      <Centered>
        <Brand />
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-5 text-sm">
          <p className="font-medium text-destructive">Acesso restrito</p>
          <p className="text-muted-foreground mt-1.5 leading-relaxed">
            Esta conta é de participante. Para entrar no painel, peça pra coordenação
            atualizar sua função.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForbidden(false);
            setPhoneInput('');
            setPhoneRaw('');
            setCode('');
          }}
          className="text-sm text-primary underline"
        >
          Tentar com outro número
        </button>
      </Centered>
    );
  }

  return (
    <Centered>
      <Brand />

      {step === 'phone' && (
        <form onSubmit={onRequestCode} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Celular</span>
            <input
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
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={requestCode.isPending || phoneRaw.length < 10}
            className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium disabled:opacity-50"
          >
            {requestCode.isPending ? 'Enviando…' : 'Enviar código'}
          </button>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            O código de 6 dígitos chega no seu WhatsApp. Acesso só pra coordenação.
          </p>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={onVerifyCode} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mandamos um código de 6 dígitos para{' '}
            <span className="font-medium text-foreground">
              {phoneMasked || maskPhoneDisplay(phoneRaw)}
            </span>
            .
          </p>
          <label className="block">
            <span className="text-sm font-medium">Código</span>
            <input
              type="text"
              autoComplete="one-time-code"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-center font-mono text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={verifyCode.isPending || code.length !== 6}
            className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium disabled:opacity-50"
          >
            {verifyCode.isPending ? 'Verificando…' : 'Entrar'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('phone');
              setCode('');
              setError(null);
            }}
            className="w-full text-sm text-muted-foreground underline"
          >
            Trocar número
          </button>
        </form>
      )}
    </Centered>
  );
}

function Brand() {
  return (
    <div className="text-center">
      <p className="font-serif text-2xl">Santa Rita — Admin</p>
      <p className="text-sm text-muted-foreground mt-1">Acesso restrito</p>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6">{children}</div>
    </div>
  );
}
