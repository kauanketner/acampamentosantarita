import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { CheckCircle2, ChevronDown, Loader2, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Field } from '@/components/form/Field';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioCard, RadioGroup } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ApiError } from '@/lib/api';
import { brl } from '@/lib/format';
import { useEventBySlug, useEventCustomQuestions } from '@/lib/queries/events';
import type { CustomQuestion } from '@/lib/queries/events';
import { useHealth } from '@/lib/queries/health';
import { useFullProfile } from '@/lib/queries/profile';
import {
  type CreateRegistrationInput,
  useCreateRegistration,
} from '@/lib/queries/registrations';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/eventos/$slug/inscricao/')({
  component: InscricaoForm,
});

type RoleIntent = 'campista' | 'equipista';

function InscricaoForm() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const { data: event, isLoading: loadingEvent } = useEventBySlug(slug);
  const { data: questions, isLoading: loadingQuestions } = useEventCustomQuestions(
    event?.id,
  );
  const { data: profile } = useFullProfile();
  const { data: health } = useHealth();
  const createReg = useCreateRegistration();

  const [role, setRole] = useState<RoleIntent | ''>('');
  const [healthOpen, setHealthOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);

  const visibleQuestions = useMemo<CustomQuestion[]>(() => {
    if (!questions || !role) return [];
    return questions.filter(
      (q) => q.appliesTo === 'ambos' || q.appliesTo === role,
    );
  }, [questions, role]);

  if (loadingEvent || !event) {
    return (
      <Page withBottomNav={false}>
        <TopBar back={`/eventos/${slug}`} title="Inscrição" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  const open = event.status === 'inscricoes_abertas' && event.allowRegistrationViaApp;
  if (!open) {
    return (
      <Page withBottomNav={false}>
        <TopBar back={`/eventos/${slug}`} title="Inscrição" border />
        <div className="px-6 py-16 text-center">
          <p className="font-display text-2xl">Inscrições fechadas.</p>
          <p className="text-sm text-(color:--color-muted-foreground) mt-2 max-w-sm mx-auto">
            Este evento não está mais aceitando inscrições pelo app.
          </p>
        </div>
      </Page>
    );
  }

  const price =
    role === 'campista'
      ? Number(event.priceCampista ?? 0)
      : role === 'equipista'
        ? Number(event.priceEquipista ?? 0)
        : 0;

  const isPaid = event.isPaid && price > 0;

  const setAnswer = (id: string, value: unknown) =>
    setAnswers((s) => ({ ...s, [id]: value }));

  const allRequiredAnswered = visibleQuestions.every((q) => {
    if (!q.required) return true;
    const a = answers[q.id];
    if (q.type === 'multi_select') return Array.isArray(a) && a.length > 0;
    if (q.type === 'bool') return a === true || a === false;
    if (a == null) return false;
    if (typeof a === 'string') return a.trim().length > 0;
    return true;
  });

  const canSubmit = !!role && allRequiredAnswered && !createReg.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setError(null);

    const customAnswers: NonNullable<CreateRegistrationInput['customAnswers']> = [];
    for (const q of visibleQuestions) {
      const v = answers[q.id];
      if (v == null || v === '') continue;
      customAnswers.push({ customQuestionId: q.id, answer: v });
    }
    const payload: CreateRegistrationInput = {
      eventId: event.id,
      roleIntent: role,
      customAnswers,
    };

    try {
      const reg = await createReg.mutateAsync(payload);
      navigate({ to: '/minhas-inscricoes/$id', params: { id: reg.id }, replace: true });
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Não foi possível enviar a inscrição. Tente de novo.');
    }
  };

  return (
    <Page withBottomNav={false}>
      <TopBar back={`/eventos/${slug}`} title="Inscrição" border />

      <form onSubmit={onSubmit}>
        <div className="px-5 pt-4 pb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
            {event.editionNumber ? `${event.editionNumber}º acampamento` : event.name}
          </p>
          <h1
            className="font-display text-[clamp(1.7rem,7vw,2.1rem)] leading-[1.05] tracking-[-0.025em] text-balance"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            Sua inscrição.
          </h1>
          <p className="mt-2 text-[15px] text-(color:--color-muted-foreground) leading-relaxed">
            {visibleQuestions.length > 0
              ? 'Três passos antes de finalizar.'
              : 'Dois passos antes de finalizar.'}
          </p>
        </div>

        {/* Step 1 — papel */}
        <SectionTitle>1 · Como você participa</SectionTitle>
        <div className="px-5">
          <RadioGroup
            value={role}
            onValueChange={(v) => setRole(v as RoleIntent)}
            className="grid gap-2.5"
          >
            {event.allowFirstTimer && event.priceCampista !== null && (
              <RadioCard value="campista" checked={role === 'campista'}>
                <p className="font-medium">Como campista</p>
                <p className="text-xs text-(color:--color-muted-foreground) mt-0.5 leading-snug">
                  Para quem vive este Santa Rita pela primeira vez. Vagas limitadas.
                </p>
                <p className="font-mono text-[11px] mt-2 text-(color:--color-foreground)">
                  {Number(event.priceCampista) === 0
                    ? 'Sem custo'
                    : brl(Number(event.priceCampista))}
                </p>
              </RadioCard>
            )}
            {event.priceEquipista !== null && (
              <RadioCard value="equipista" checked={role === 'equipista'}>
                <p className="font-medium">Como equipista</p>
                <p className="text-xs text-(color:--color-muted-foreground) mt-0.5 leading-snug">
                  Você serve em uma das equipes. Reuniões de equipe são obrigatórias.
                </p>
                <p className="font-mono text-[11px] mt-2 text-(color:--color-foreground)">
                  {Number(event.priceEquipista) === 0
                    ? 'Sem custo'
                    : brl(Number(event.priceEquipista))}
                </p>
              </RadioCard>
            )}
            {!event.allowFirstTimer && event.priceCampista === null && (
              <p className="text-xs text-(color:--color-muted-foreground)">
                Este evento aceita apenas equipistas.
              </p>
            )}
          </RadioGroup>
        </div>

        {/* Step 2 — health review */}
        <SectionTitle>2 · Revisão de saúde</SectionTitle>
        <div className="px-5">
          <Card>
            <button
              type="button"
              onClick={() => setHealthOpen((v) => !v)}
              className="w-full flex items-start gap-3 p-4 text-left"
            >
              <div className="size-9 rounded-full bg-(color:--color-primary-soft) text-(color:--color-primary) inline-flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[15px]">
                  {health
                    ? 'Confirme se nada mudou'
                    : 'Você ainda não preencheu o perfil de saúde'}
                </p>
                <p className="text-xs text-(color:--color-muted-foreground) mt-0.5 leading-snug">
                  {health?.lastReviewedAt
                    ? `Última atualização ${formatRelativeDays(health.lastReviewedAt)}.`
                    : 'É obrigatório antes da inscrição.'}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  'size-5 mt-2 shrink-0 text-(color:--color-muted-foreground) transition-transform',
                  healthOpen && 'rotate-180',
                )}
                strokeWidth={1.5}
              />
            </button>
            {healthOpen && (
              <CardBody className="border-t border-(color:--color-border) pt-4">
                <ul className="grid gap-2.5">
                  <ReviewRow
                    label="Doença crônica"
                    value={
                      health?.hasChronicDisease
                        ? health.chronicDiseaseDetail || 'Sim'
                        : 'Não'
                    }
                    highlight={!!health?.hasChronicDisease}
                  />
                  <ReviewRow
                    label="Alergia"
                    value={
                      health?.hasAllergy ? health.allergyDetail || 'Sim' : 'Não'
                    }
                    highlight={!!health?.hasAllergy}
                  />
                  <ReviewRow
                    label="Restrição alimentar"
                    value={
                      health?.hasDietaryRestriction
                        ? health.dietaryRestrictionDetail || 'Sim'
                        : 'Não'
                    }
                    highlight={!!health?.hasDietaryRestriction}
                  />
                  <ReviewRow
                    label="Medicação contínua"
                    value={health?.continuousMedications || 'Nenhuma'}
                  />
                </ul>
                <Button asChild variant="link" size="sm" className="mt-3 -ml-2">
                  <Link to="/perfil/saude">
                    <Pencil className="size-3.5" /> Atualizar perfil de saúde
                  </Link>
                </Button>
              </CardBody>
            )}
          </Card>
          {!health && (
            <p className="text-xs text-(color:--color-destructive) mt-2">
              Toque em "Atualizar perfil de saúde" e preencha antes de continuar.
            </p>
          )}
        </div>

        {/* Step 3 — custom questions */}
        {visibleQuestions.length > 0 && (
          <>
            <SectionTitle>3 · Perguntas do evento</SectionTitle>
            <div className="px-5 grid gap-4">
              {loadingQuestions ? (
                <Loader2 className="size-4 animate-spin text-(color:--color-muted-foreground) mx-auto" />
              ) : (
                visibleQuestions.map((q) => (
                  <QuestionField
                    key={q.id}
                    question={q}
                    value={answers[q.id]}
                    onChange={(v) => setAnswer(q.id, v)}
                  />
                ))
              )}
            </div>
          </>
        )}

        <div className="px-5 mt-6">
          <Separator variant="ornament" />
        </div>

        <div className="px-5 py-6">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-sm text-(color:--color-muted-foreground)">
              {isPaid ? 'Total' : 'Custo'}
            </p>
            <p
              className="font-display text-3xl tracking-tight"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
            >
              {!role ? '—' : isPaid ? brl(price) : 'Sem custo'}
            </p>
          </div>
          {isPaid && (
            <p className="text-xs text-(color:--color-muted-foreground) leading-relaxed mb-4">
              Após a inscrição, a coordenação envia as instruções de pagamento.
            </p>
          )}

          {error && (
            <p className="text-sm text-(color:--color-destructive) text-center mb-3">
              {error}
            </p>
          )}

          <Button type="submit" block size="lg" disabled={!canSubmit}>
            {createReg.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Enviando…
              </>
            ) : (
              'Enviar inscrição'
            )}
          </Button>
          {!profile && (
            <p className="text-xs text-(color:--color-muted-foreground) mt-2 text-center">
              Carregando seu perfil…
            </p>
          )}
        </div>
      </form>
    </Page>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: CustomQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const labelEl = (
    <Label>
      {question.question}
      {question.required && <span className="text-(color:--color-destructive)"> *</span>}
    </Label>
  );

  switch (question.type) {
    case 'text':
      return (
        <Field label={labelEl}>
          <Input
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
    case 'textarea':
      return (
        <Field label={labelEl}>
          <Textarea
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-28"
          />
        </Field>
      );
    case 'number':
      return (
        <Field label={labelEl}>
          <Input
            type="number"
            inputMode="numeric"
            value={(value as number | string) ?? ''}
            onChange={(e) =>
              onChange(e.target.value === '' ? undefined : Number(e.target.value))
            }
          />
        </Field>
      );
    case 'date':
      return (
        <Field label={labelEl}>
          <Input
            type="date"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
    case 'bool':
      return (
        <Field label={labelEl}>
          <label className="flex items-center justify-between rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) px-4 py-3 cursor-pointer">
            <span className="text-[15px] text-(color:--color-muted-foreground)">
              {value === true ? 'Sim' : value === false ? 'Não' : 'Toque para responder'}
            </span>
            <Switch
              checked={value === true}
              onCheckedChange={(v) => onChange(v)}
            />
          </label>
        </Field>
      );
    case 'select': {
      const options = question.options?.options ?? [];
      return (
        <Field label={labelEl}>
          <Select
            value={(value as string) ?? ''}
            onValueChange={(v) => onChange(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      );
    }
    case 'multi_select': {
      const options = question.options?.options ?? [];
      const arr = Array.isArray(value) ? (value as string[]) : [];
      const toggle = (v: string) =>
        onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
      return (
        <Field label={labelEl}>
          <div className="grid gap-1.5">
            {options.map((o) => {
              const checked = arr.includes(o.value);
              return (
                <label
                  key={o.value}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-(--radius-sm) border cursor-pointer text-sm transition',
                    checked
                      ? 'border-(color:--color-primary) bg-(color:--color-primary-soft)'
                      : 'border-(color:--color-border) bg-(color:--color-surface) hover:bg-(color:--color-muted)',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(o.value)}
                  />
                  {o.label}
                </label>
              );
            })}
          </div>
        </Field>
      );
    }
    default:
      return null;
  }
}

function ReviewRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <li className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-sm text-(color:--color-muted-foreground)">{label}</span>
      <span
        className={cn(
          'text-[14px] font-medium text-right text-pretty',
          highlight && 'text-(color:--color-primary)',
        )}
      >
        {value}
      </span>
    </li>
  );
}

function formatRelativeDays(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return 'hoje';
  if (days === 1) return 'há 1 dia';
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
}
