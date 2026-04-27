import { createFileRoute } from '@tanstack/react-router';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field } from '@/components/form/Field';
import { HealthQuestion } from '@/components/form/HealthQuestion';
import { Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCadastroStore } from '@/lib/cadastro-store';

export const Route = createFileRoute('/cadastro/veterano/passo-5')({
  component: PassoCinco,
});

function PassoCinco() {
  const h = useCadastroStore((s) => s.health);
  const setHealth = useCadastroStore((s) => s.setHealth);

  return (
    <CadastroFrame
      step={5}
      total={6}
      variant="veterano"
      eyebrow="Passo 5 — Saúde"
      title="Confirme as condições de saúde."
      description="Você revisa essas respostas a cada nova inscrição. Confidenciais."
      ctaTo="/cadastro/veterano/passo-6"
    >
      <div className="grid gap-2.5">
        <HealthQuestion
          label="Tem alguma doença crônica?"
          value={h.hasChronicDisease}
          onValueChange={(v) => setHealth({ hasChronicDisease: v })}
          detail={h.chronicDiseaseDetail}
          onDetailChange={(v) => setHealth({ chronicDiseaseDetail: v })}
        />
        <HealthQuestion
          label="Tem alguma alergia?"
          value={h.hasAllergy}
          onValueChange={(v) => setHealth({ hasAllergy: v })}
          detail={h.allergyDetail}
          onDetailChange={(v) => setHealth({ allergyDetail: v })}
        />
        <HealthQuestion
          label="Restrição alimentar?"
          value={h.hasDietaryRestriction}
          onValueChange={(v) => setHealth({ hasDietaryRestriction: v })}
          detail={h.dietaryRestrictionDetail}
          onDetailChange={(v) => setHealth({ dietaryRestrictionDetail: v })}
        />

        <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) divide-y divide-(color:--color-border)">
          <SimpleToggle
            label="Asma"
            value={h.hasAsthma}
            onChange={(v) => setHealth({ hasAsthma: v })}
          />
          <SimpleToggle
            label="Diabetes"
            value={h.hasDiabetes}
            onChange={(v) => setHealth({ hasDiabetes: v })}
          />
          <SimpleToggle
            label="Hipertensão"
            value={h.hasHypertension}
            onChange={(v) => setHealth({ hasHypertension: v })}
          />
        </div>

        <Field
          label={<Label htmlFor="meds">Medicações contínuas</Label>}
          hint="O que você toma todos os dias, com a dose."
        >
          <Textarea
            id="meds"
            value={h.continuousMedications}
            onChange={(e) => setHealth({ continuousMedications: e.target.value })}
            placeholder="Ex.: Levotiroxina 50mcg, jejum"
          />
        </Field>

        <Field label={<Label htmlFor="obs">Observações</Label>} optional>
          <Textarea
            id="obs"
            value={h.generalObservations}
            onChange={(e) => setHealth({ generalObservations: e.target.value })}
            placeholder="Qualquer coisa que a equipe deva saber"
          />
        </Field>
      </div>
    </CadastroFrame>
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
