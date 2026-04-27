import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Pré-checagens visuais para o usuário entender o que falta
  const issues = useMissingFieldIssues();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (issues.length > 0) {
      setError(issues[0]!);
      return;
    }

    setSubmitting(true);

    const payload = buildSignupPayload(cadastroState, email || undefined);

    try {
      const result = await register.mutateAsync(payload);

      // Avatar: requer sessão. Como ainda não temos sessão (precisa código),
      // vamos guardar o File no store e fazer upload depois do verify-code.
      // Por enquanto pulamos o upload. (TODO: subir após verify-code).

      const phoneRaw = cadastroState.phone;
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
      <TopBar back="/cadastro/primeira-vez/passo-5" />
      <div className="px-5 pt-2 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          Quase lá
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Confirmando o seu <span className="font-display-italic">WhatsApp</span>.
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-(color:--color-muted-foreground) text-pretty">
          Vamos enviar um código no número que você informou no passo 1. Toda vez que
          for entrar daqui pra frente, é só pedir um código.
        </p>
      </div>

      <form onSubmit={onSubmit} className="px-5 grid gap-4 pb-32">
        <Field
          label={<Label htmlFor="email">E-mail</Label>}
          optional
          hint="Para receber comprovantes e avisos importantes (não obrigatório)."
        >
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </Field>

        {issues.length > 0 && (
          <div className="rounded-(--radius-md) border border-(color:--color-destructive)/40 bg-(color:--color-destructive)/5 p-4 text-sm text-(color:--color-destructive)">
            <p className="font-medium mb-1">Falta preencher:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              {issues.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        {error && !issues.length && (
          <p className="text-sm text-(color:--color-destructive) text-center">{error}</p>
        )}

        <div className="fixed inset-x-0 bottom-0 z-30 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-(color:--color-background)/85 backdrop-blur-md border-t border-(color:--color-border)">
          <Button
            type="submit"
            block
            size="lg"
            disabled={submitting || issues.length > 0}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Enviando código…
              </>
            ) : (
              'Enviar código no WhatsApp'
            )}
          </Button>
        </div>
      </form>
    </Page>
  );
}

function useMissingFieldIssues() {
  const s = useCadastroStore();
  const issues: string[] = [];
  if (!s.fullName) issues.push('Seu nome (passo 1)');
  if (!s.phone || s.phone.length < 10) issues.push('Seu telefone com WhatsApp (passo 1)');
  if (s.emergencyContacts.filter((c) => c.name && c.phone).length < 2) {
    issues.push('Pelo menos 2 contatos de emergência (passo 3)');
  }
  return issues;
}
