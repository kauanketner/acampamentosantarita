import { Field } from '@/components/form/Field';
import { HealthQuestion } from '@/components/form/HealthQuestion';
import { Page } from '@/components/shell/Page';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { TopBar } from '@/components/shell/TopBar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ApiError } from '@/lib/api';
import {
  type HealthProfile,
  type HealthUpsertInput,
  useHealth,
  useUpdateHealth,
} from '@/lib/queries/health';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_auth/perfil/saude')({
  component: PerfilSaude,
});

type Form = {
  hasChronicDisease: boolean;
  chronicDiseaseDetail: string;
  hadSurgery: boolean;
  surgeryDetail: string;
  hasAllergy: boolean;
  allergyDetail: string;
  hasDietaryRestriction: boolean;
  dietaryRestrictionDetail: string;
  hasAddiction: boolean;
  addictionDetail: string;
  hasAsthma: boolean;
  usesInhaler: boolean;
  hasDiabetes: boolean;
  insulinDependent: boolean;
  hasHypertension: boolean;
  hasSleepwalking: boolean;
  vaccineCovid: boolean;
  vaccineFlu: boolean;
  vaccineYellowFever: boolean;
  continuousMedications: string;
  painMedications: string;
  generalObservations: string;
};

const empty: Form = {
  hasChronicDisease: false,
  chronicDiseaseDetail: '',
  hadSurgery: false,
  surgeryDetail: '',
  hasAllergy: false,
  allergyDetail: '',
  hasDietaryRestriction: false,
  dietaryRestrictionDetail: '',
  hasAddiction: false,
  addictionDetail: '',
  hasAsthma: false,
  usesInhaler: false,
  hasDiabetes: false,
  insulinDependent: false,
  hasHypertension: false,
  hasSleepwalking: false,
  vaccineCovid: false,
  vaccineFlu: false,
  vaccineYellowFever: false,
  continuousMedications: '',
  painMedications: '',
  generalObservations: '',
};

function fromServer(h: HealthProfile | null): Form {
  if (!h) return empty;
  return {
    hasChronicDisease: h.hasChronicDisease,
    chronicDiseaseDetail: h.chronicDiseaseDetail ?? '',
    hadSurgery: h.hadSurgery,
    surgeryDetail: h.surgeryDetail ?? '',
    hasAllergy: h.hasAllergy,
    allergyDetail: h.allergyDetail ?? '',
    hasDietaryRestriction: h.hasDietaryRestriction,
    dietaryRestrictionDetail: h.dietaryRestrictionDetail ?? '',
    hasAddiction: h.hasAddiction,
    addictionDetail: h.addictionDetail ?? '',
    hasAsthma: h.hasAsthma,
    usesInhaler: h.usesInhaler,
    hasDiabetes: h.hasDiabetes,
    insulinDependent: h.insulinDependent,
    hasHypertension: h.hasHypertension,
    hasSleepwalking: h.hasSleepwalking,
    vaccineCovid: h.vaccineCovid,
    vaccineFlu: h.vaccineFlu,
    vaccineYellowFever: h.vaccineYellowFever,
    continuousMedications: h.continuousMedications ?? '',
    painMedications: h.painMedications ?? '',
    generalObservations: h.generalObservations ?? '',
  };
}

function toServer(f: Form): HealthUpsertInput {
  const trim = (s: string) => (s.trim() === '' ? null : s.trim());
  return {
    hasChronicDisease: f.hasChronicDisease,
    chronicDiseaseDetail: f.hasChronicDisease ? trim(f.chronicDiseaseDetail) : null,
    hadSurgery: f.hadSurgery,
    surgeryDetail: f.hadSurgery ? trim(f.surgeryDetail) : null,
    hasAllergy: f.hasAllergy,
    allergyDetail: f.hasAllergy ? trim(f.allergyDetail) : null,
    hasDietaryRestriction: f.hasDietaryRestriction,
    dietaryRestrictionDetail: f.hasDietaryRestriction ? trim(f.dietaryRestrictionDetail) : null,
    hasAddiction: f.hasAddiction,
    addictionDetail: f.hasAddiction ? trim(f.addictionDetail) : null,
    hasAsthma: f.hasAsthma,
    usesInhaler: f.hasAsthma ? f.usesInhaler : false,
    hasDiabetes: f.hasDiabetes,
    insulinDependent: f.hasDiabetes ? f.insulinDependent : false,
    hasHypertension: f.hasHypertension,
    hasSleepwalking: f.hasSleepwalking,
    vaccineCovid: f.vaccineCovid,
    vaccineFlu: f.vaccineFlu,
    vaccineYellowFever: f.vaccineYellowFever,
    continuousMedications: trim(f.continuousMedications),
    painMedications: trim(f.painMedications),
    generalObservations: trim(f.generalObservations),
  };
}

function PerfilSaude() {
  const { data: health, isLoading } = useHealth();
  const update = useUpdateHealth();

  const [form, setForm] = useState<Form>(empty);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoading || hydrated) return;
    setForm(fromServer(health ?? null));
    setHydrated(true);
  }, [health, isLoading, hydrated]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      await update.mutateAsync(toServer(form));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  const lastReview = health?.lastReviewedAt;

  if (isLoading && !hydrated) {
    return (
      <Page>
        <TopBar back="/perfil" title="Saúde" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <TopBar back="/perfil" title="Saúde" border />

      <form onSubmit={onSubmit}>
        <div className="px-5 pt-4 pb-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
            Confidencial — equipe de cuidado
          </p>
          <h1
            className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em]"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            Saúde.
          </h1>
          {lastReview && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(color:--color-accent-soft) text-(color:--color-accent-foreground)">
              <ShieldCheck className="size-3.5" strokeWidth={1.8} />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                Última revisão · {formatRelativeDays(lastReview)}
              </span>
            </div>
          )}
        </div>

        <SectionTitle>Em geral</SectionTitle>
        <div className="px-5 grid gap-2.5">
          <HealthQuestion
            label="Tem alguma doença crônica?"
            value={form.hasChronicDisease}
            onValueChange={(v) => set('hasChronicDisease', v)}
            detail={form.chronicDiseaseDetail}
            onDetailChange={(v) => set('chronicDiseaseDetail', v)}
          />
          <HealthQuestion
            label="Tem alguma alergia?"
            value={form.hasAllergy}
            onValueChange={(v) => set('hasAllergy', v)}
            detail={form.allergyDetail}
            onDetailChange={(v) => set('allergyDetail', v)}
            detailPlaceholder="Penicilina, AAS, frutos do mar…"
          />
          <HealthQuestion
            label="Restrição alimentar?"
            value={form.hasDietaryRestriction}
            onValueChange={(v) => set('hasDietaryRestriction', v)}
            detail={form.dietaryRestrictionDetail}
            onDetailChange={(v) => set('dietaryRestrictionDetail', v)}
          />
          <HealthQuestion
            label="Já passou por alguma cirurgia?"
            value={form.hadSurgery}
            onValueChange={(v) => set('hadSurgery', v)}
            detail={form.surgeryDetail}
            onDetailChange={(v) => set('surgeryDetail', v)}
          />
          <HealthQuestion
            label="Tem alguma dependência?"
            hint="Confidencial. Ajuda a equipe a cuidar de você."
            value={form.hasAddiction}
            onValueChange={(v) => set('hasAddiction', v)}
            detail={form.addictionDetail}
            onDetailChange={(v) => set('addictionDetail', v)}
          />
        </div>

        <SectionTitle>Condições</SectionTitle>
        <div className="px-5 grid gap-2.5">
          <ConditionCard
            label="Asma"
            value={form.hasAsthma}
            onChange={(v) => set('hasAsthma', v)}
            secondary={
              form.hasAsthma
                ? {
                    label: 'Usa bombinha?',
                    value: form.usesInhaler,
                    onChange: (v) => set('usesInhaler', v),
                  }
                : undefined
            }
          />
          <ConditionCard
            label="Diabetes"
            value={form.hasDiabetes}
            onChange={(v) => set('hasDiabetes', v)}
            secondary={
              form.hasDiabetes
                ? {
                    label: 'Insulino-dependente?',
                    value: form.insulinDependent,
                    onChange: (v) => set('insulinDependent', v),
                  }
                : undefined
            }
          />
          <ConditionCard
            label="Hipertensão"
            value={form.hasHypertension}
            onChange={(v) => set('hasHypertension', v)}
          />
          <ConditionCard
            label="Sonambulismo"
            value={form.hasSleepwalking}
            onChange={(v) => set('hasSleepwalking', v)}
          />
        </div>

        <SectionTitle>Vacinas</SectionTitle>
        <div className="px-5">
          <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) divide-y divide-(color:--color-border)">
            <SimpleToggle
              label="COVID-19"
              value={form.vaccineCovid}
              onChange={(v) => set('vaccineCovid', v)}
            />
            <SimpleToggle
              label="Influenza (gripe)"
              value={form.vaccineFlu}
              onChange={(v) => set('vaccineFlu', v)}
            />
            <SimpleToggle
              label="Febre amarela"
              value={form.vaccineYellowFever}
              onChange={(v) => set('vaccineYellowFever', v)}
            />
          </div>
        </div>

        <SectionTitle>Medicações & observações</SectionTitle>
        <div className="px-5 pb-32 grid gap-4">
          <Field label={<Label htmlFor="continuous">Medicações contínuas</Label>} optional>
            <Textarea
              id="continuous"
              value={form.continuousMedications}
              onChange={(e) => set('continuousMedications', e.target.value)}
              placeholder="Ex.: Levotiroxina 50mcg em jejum"
            />
          </Field>
          <Field label={<Label htmlFor="pain">Para dor / SOS</Label>} optional>
            <Textarea
              id="pain"
              value={form.painMedications}
              onChange={(e) => set('painMedications', e.target.value)}
              placeholder="Pode tomar dipirona / paracetamol etc."
            />
          </Field>
          <Field label={<Label htmlFor="obs">Observações</Label>} optional>
            <Textarea
              id="obs"
              value={form.generalObservations}
              onChange={(e) => set('generalObservations', e.target.value)}
              placeholder="Algo que a equipe deva saber"
            />
          </Field>
        </div>

        {error && (
          <p className="px-5 pb-3 text-sm text-(color:--color-destructive) text-center">{error}</p>
        )}
        {saved && !error && (
          <p className="px-5 pb-3 text-sm text-(color:--color-primary) text-center">
            Salvo e revisão atualizada.
          </p>
        )}

        <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-20 px-5 pt-3 pb-2 bg-gradient-to-t from-(color:--color-background) via-(color:--color-background)/90 to-transparent">
          <Button type="submit" block size="lg" disabled={update.isPending}>
            {update.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Salvando…
              </>
            ) : (
              'Salvar e atualizar revisão'
            )}
          </Button>
        </div>
      </form>
    </Page>
  );
}

function ConditionCard({
  label,
  value,
  onChange,
  secondary,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  secondary?: { label: string; value: boolean; onChange: (v: boolean) => void };
}) {
  return (
    <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface)">
      <label className="flex items-center justify-between px-4 py-3 cursor-pointer">
        <span className="text-[15px] font-medium">{label}</span>
        <Switch checked={value} onCheckedChange={onChange} />
      </label>
      {secondary && (
        <label className="flex items-center justify-between px-4 py-3 cursor-pointer border-t border-(color:--color-border) bg-(color:--color-primary-soft)/40">
          <span className="text-sm text-(color:--color-muted-foreground)">{secondary.label}</span>
          <Switch checked={secondary.value} onCheckedChange={secondary.onChange} />
        </label>
      )}
    </div>
  );
}

function SimpleToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between px-4 py-3 cursor-pointer">
      <span className="text-[15px]">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </label>
  );
}

function formatRelativeDays(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return 'hoje';
  if (days === 1) return 'há 1 dia';
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months === 1) return 'há 1 mês';
  if (months < 12) return `há ${months} meses`;
  const years = Math.floor(months / 12);
  return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}
