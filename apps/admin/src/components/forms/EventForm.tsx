import type { AdminEventBase, EventInput, EventStatus, EventType } from '@/lib/queries/events';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  initial?: AdminEventBase | null;
  submitting?: boolean;
  errorMessage?: string | null;
  submitLabel: string;
  onSubmit: (input: EventInput) => void;
  onCancel?: () => void;
};

type FormState = {
  name: string;
  slug: string;
  type: EventType;
  editionNumber: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  coverImageUrl: string;
  status: EventStatus;
  maxParticipants: string;
  allowFirstTimer: boolean;
  isPaid: boolean;
  priceCampista: string;
  priceEquipista: string;
  registrationDeadline: string;
  allowRegistrationViaApp: boolean;
  allowRegistrationViaSite: boolean;
  requiresAdminApproval: boolean;
};

const TYPES: { value: EventType; label: string }[] = [
  { value: 'acampamento', label: 'Acampamento' },
  { value: 'retiro', label: 'Retiro' },
  { value: 'encontro', label: 'Encontro' },
  { value: 'formacao', label: 'Formação' },
  { value: 'outro', label: 'Outro' },
];

const STATUSES: { value: EventStatus; label: string }[] = [
  { value: 'rascunho', label: 'Rascunho (não aparece)' },
  { value: 'inscricoes_abertas', label: 'Inscrições abertas' },
  { value: 'inscricoes_fechadas', label: 'Inscrições fechadas' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function fromInitial(e: AdminEventBase | null | undefined): FormState {
  if (!e) {
    return {
      name: '',
      slug: '',
      type: 'acampamento',
      editionNumber: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      coverImageUrl: '',
      status: 'rascunho',
      maxParticipants: '',
      allowFirstTimer: false,
      isPaid: true,
      priceCampista: '',
      priceEquipista: '',
      registrationDeadline: '',
      allowRegistrationViaApp: true,
      allowRegistrationViaSite: false,
      requiresAdminApproval: true,
    };
  }
  return {
    name: e.name,
    slug: e.slug,
    type: e.type,
    editionNumber: e.editionNumber?.toString() ?? '',
    startDate: e.startDate,
    endDate: e.endDate,
    location: e.location ?? '',
    description: e.description ?? '',
    coverImageUrl: e.coverImageUrl ?? '',
    status: e.status,
    maxParticipants: e.maxParticipants?.toString() ?? '',
    allowFirstTimer: e.allowFirstTimer,
    isPaid: e.isPaid,
    priceCampista: e.priceCampista ?? '',
    priceEquipista: e.priceEquipista ?? '',
    registrationDeadline: e.registrationDeadline ? e.registrationDeadline.slice(0, 16) : '',
    allowRegistrationViaApp: e.allowRegistrationViaApp,
    allowRegistrationViaSite: e.allowRegistrationViaSite,
    requiresAdminApproval: e.requiresAdminApproval,
  };
}

export function EventForm({
  initial,
  submitting,
  errorMessage,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<FormState>(() => fromInitial(initial));
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);

  useEffect(() => {
    if (initial) {
      setForm(fromInitial(initial));
      setSlugTouched(true);
    }
  }, [initial]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const onNameChange = (v: string) => {
    set('name', v);
    if (!slugTouched) {
      const next = slugify(v);
      setForm((s) => ({ ...s, name: v, slug: next }));
    }
  };

  const isAcampamento = form.type === 'acampamento';
  const canSubmit = useMemo(() => {
    if (form.name.trim().length < 2) return false;
    if (form.slug.trim().length < 2) return false;
    if (!form.startDate || !form.endDate) return false;
    if (form.endDate < form.startDate) return false;
    if (isAcampamento && !form.editionNumber) return false;
    return true;
  }, [form, isAcampamento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const payload: EventInput = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      type: form.type,
      editionNumber: form.editionNumber ? Number.parseInt(form.editionNumber, 10) : null,
      startDate: form.startDate,
      endDate: form.endDate,
      location: form.location.trim() || null,
      description: form.description.trim() || null,
      coverImageUrl: form.coverImageUrl.trim() || null,
      status: form.status,
      maxParticipants: form.maxParticipants ? Number.parseInt(form.maxParticipants, 10) : null,
      allowFirstTimer: isAcampamento ? form.allowFirstTimer : false,
      isPaid: form.isPaid,
      priceCampista:
        form.isPaid && form.priceCampista ? Number.parseFloat(form.priceCampista).toFixed(2) : null,
      priceEquipista:
        form.isPaid && form.priceEquipista
          ? Number.parseFloat(form.priceEquipista).toFixed(2)
          : null,
      registrationDeadline: form.registrationDeadline
        ? new Date(form.registrationDeadline).toISOString()
        : null,
      allowRegistrationViaApp: form.allowRegistrationViaApp,
      allowRegistrationViaSite: form.allowRegistrationViaSite,
      requiresAdminApproval: form.requiresAdminApproval,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Section title="Identificação">
        <Field label="Nome do evento" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="14º Acampamento Santa Rita"
            className={inputClass}
            required
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Slug (URL)" required hint="Auto-preenchido pelo nome">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                set('slug', slugify(e.target.value));
                setSlugTouched(true);
              }}
              className={`${inputClass} font-mono`}
              required
            />
          </Field>
          <Field label="Tipo" required>
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value as EventType)}
              className={inputClass}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          {isAcampamento && (
            <Field label="Edição" required hint="14 = 14º acampamento">
              <input
                type="number"
                min={1}
                max={999}
                value={form.editionNumber}
                onChange={(e) => set('editionNumber', e.target.value)}
                className={inputClass}
                required
              />
            </Field>
          )}
        </div>
      </Section>

      <Section title="Quando e onde">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Início" required>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Fim" required>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
        </div>
        <Field label="Local" hint="Sítio, paróquia, cidade">
          <input
            type="text"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="Sítio Santa Rita — Caieiras/SP"
            className={inputClass}
          />
        </Field>
        <Field label="Descrição" hint="Use parágrafos separados por linha em branco">
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={6}
            className={inputClass}
          />
        </Field>
        <Field label="URL da capa" hint="Imagem que aparece no app e site">
          <input
            type="url"
            value={form.coverImageUrl}
            onChange={(e) => set('coverImageUrl', e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Inscrição">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Status" required>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as EventStatus)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Vagas" hint="Deixe vazio se não há limite">
            <input
              type="number"
              min={1}
              value={form.maxParticipants}
              onChange={(e) => set('maxParticipants', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Inscrições até" hint="Data e hora limite">
          <input
            type="datetime-local"
            value={form.registrationDeadline}
            onChange={(e) => set('registrationDeadline', e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Toggle
            label="Aceita inscrição pelo app"
            value={form.allowRegistrationViaApp}
            onChange={(v) => set('allowRegistrationViaApp', v)}
          />
          <Toggle
            label="Aceita inscrição pelo site público"
            value={form.allowRegistrationViaSite}
            onChange={(v) => set('allowRegistrationViaSite', v)}
          />
          <Toggle
            label="Exige aprovação manual"
            value={form.requiresAdminApproval}
            onChange={(v) => set('requiresAdminApproval', v)}
          />
        </div>
        {isAcampamento && (
          <Toggle
            label="Aceita pessoas em primeira vez"
            hint="Apenas acampamentos numerados podem aceitar estreantes."
            value={form.allowFirstTimer}
            onChange={(v) => set('allowFirstTimer', v)}
          />
        )}
      </Section>

      <Section title="Cobrança">
        <Toggle
          label="Evento pago"
          hint="Desligue para gerar inscrições isentas."
          value={form.isPaid}
          onChange={(v) => set('isPaid', v)}
        />
        {form.isPaid && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Valor campista (R$)">
              <input
                type="number"
                step="0.01"
                min={0}
                value={form.priceCampista}
                onChange={(e) => set('priceCampista', e.target.value)}
                placeholder="280.00"
                className={inputClass}
              />
            </Field>
            <Field label="Valor equipista (R$)">
              <input
                type="number"
                step="0.01"
                min={0}
                value={form.priceEquipista}
                onChange={(e) => set('priceEquipista', e.target.value)}
                placeholder="180.00"
                className={inputClass}
              />
            </Field>
          </div>
        )}
      </Section>

      {errorMessage && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? 'Salvando…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-5 py-2 text-sm hover:bg-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-4">
      <h2 className="font-serif text-lg">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border bg-background p-3 cursor-pointer hover:bg-secondary/30 transition">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5"
      />
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
    </label>
  );
}
