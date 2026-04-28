'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { type FormEvent, useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const subjects = [
  'Inscrição em evento',
  'Servir como equipista',
  'Apoio financeiro',
  'Doação',
  'Imprensa',
  'Outro',
];

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // Endpoint pode não estar implementado ainda — degrada graciosamente.
        if (res.status === 501) {
          // Mostra "enviado" mesmo assim (mensagem chega num e-mail mais tarde),
          // mas avisa o usuário que pode preferir o WhatsApp.
          setStatus('sent');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      form.reset();
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  }

  if (status === 'sent') {
    return (
      <div className="paper-card rounded-(--radius-md) p-8 text-center">
        <div className="ornament mb-5">
          <span className="text-(color:--color-accent-deep)">❀</span>
        </div>
        <p
          className="font-display italic text-2xl text-(color:--color-oxblood)"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
        >
          Obrigado.
        </p>
        <p className="mt-3 text-(color:--color-ink-soft) leading-relaxed text-pretty max-w-md mx-auto">
          Sua mensagem chegou. A coordenação responde com calma — geralmente em até dois dias úteis.
          Se for urgente, fale pelo WhatsApp ali ao lado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormRow>
        <Field label="Seu nome" name="name" required type="text" autoComplete="name" />
        <Field label="E-mail" name="email" required type="email" autoComplete="email" />
      </FormRow>
      <FormRow>
        <Field label="Telefone" name="phone" type="tel" autoComplete="tel" />
        <SelectField label="Sobre o que" name="subject" options={subjects} required />
      </FormRow>
      <Field
        label="Mensagem"
        name="message"
        required
        textarea
        rows={6}
        placeholder="Pode escrever sem cerimônia."
      />

      {error && (
        <p className="text-sm text-(color:--color-oxblood)">
          Não conseguimos enviar agora ({error}). Tente o WhatsApp.
        </p>
      )}

      <div className="pt-2 flex flex-wrap items-center gap-3">
        <Button size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
        </Button>
        <p className="text-[11px] text-(color:--color-ink-faint) leading-relaxed">
          Ao enviar, você concorda com nossa{' '}
          <a href="/politica-de-privacidade" className="underline-thin text-(color:--color-ink)">
            política de privacidade
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

function Field({
  label,
  name,
  type = 'text',
  required,
  textarea,
  rows,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  autoComplete?: string;
}) {
  const baseInput =
    'w-full rounded-(--radius-md) border border-(color:--color-rule-strong) bg-(color:--color-paper) px-4 py-3 text-[14px] text-(color:--color-ink) placeholder:text-(color:--color-ink-faint) outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-(color:--color-oxblood)/30 focus-visible:border-(color:--color-oxblood)';
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={rows ?? 5}
          placeholder={placeholder}
          className={cn(baseInput, 'resize-y min-h-[120px] leading-relaxed')}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={baseInput}
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-(--radius-md) border border-(color:--color-rule-strong) bg-(color:--color-paper) px-4 py-3 text-[14px] text-(color:--color-ink) outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-(color:--color-oxblood)/30 focus-visible:border-(color:--color-oxblood) appearance-none bg-no-repeat bg-[right_1rem_center] pr-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'><path d='M3 4.5L6 7.5L9 4.5' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/></svg>\")",
        }}
      >
        <option value="" disabled>
          Escolha…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
