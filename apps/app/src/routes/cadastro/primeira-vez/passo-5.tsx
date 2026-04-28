import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field } from '@/components/form/Field';
import { HealthQuestion } from '@/components/form/HealthQuestion';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useCadastroStore } from '@/lib/cadastro-store';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-5')({
  component: PassoCinco,
});

function PassoCinco() {
  const h = useCadastroStore((s) => s.health);
  const setHealth = useCadastroStore((s) => s.setHealth);

  return (
    <CadastroFrame
      step={5}
      total={5}
      variant="primeira-vez"
      eyebrow="Passo 5 — Para cuidarmos bem de você"
      title="Saúde."
      description="As respostas ficam confidenciais com a equipe de bem-estar e cozinha. Nada é compartilhado com outros participantes."
      ctaTo="/cadastro/primeira-vez/concluido"
      ctaLabel="Continuar"
    >
      <div className="grid gap-2.5">
        <HealthQuestion
          label="Você tem alguma doença crônica?"
          hint="Hipotireoidismo, fibromialgia, etc."
          value={h.hasChronicDisease}
          onValueChange={(v) => setHealth({ hasChronicDisease: v })}
          detail={h.chronicDiseaseDetail}
          onDetailChange={(v) => setHealth({ chronicDiseaseDetail: v })}
          detailPlaceholder="Conte qual e como tem cuidado."
        />
        <HealthQuestion
          label="Já passou por alguma cirurgia?"
          value={h.hadSurgery}
          onValueChange={(v) => setHealth({ hadSurgery: v })}
          detail={h.surgeryDetail}
          onDetailChange={(v) => setHealth({ surgeryDetail: v })}
          detailPlaceholder="Qual e quando."
        />
        <HealthQuestion
          label="Tem alguma alergia?"
          hint="Alimentar, medicamentosa, ambiental."
          value={h.hasAllergy}
          onValueChange={(v) => setHealth({ hasAllergy: v })}
          detail={h.allergyDetail}
          onDetailChange={(v) => setHealth({ allergyDetail: v })}
          detailPlaceholder="A que e qual a reação?"
        />

        <SubGroup label="Asma">
          <Toggle
            label="Tem asma"
            value={h.hasAsthma}
            onChange={(v) => setHealth({ hasAsthma: v })}
          />
          {h.hasAsthma && (
            <Toggle
              label="Usa bombinha"
              value={h.usesInhaler}
              onChange={(v) => setHealth({ usesInhaler: v })}
            />
          )}
        </SubGroup>

        <SubGroup label="Diabetes">
          <Toggle
            label="Tem diabetes"
            value={h.hasDiabetes}
            onChange={(v) => setHealth({ hasDiabetes: v })}
          />
          {h.hasDiabetes && (
            <Toggle
              label="É insulinodependente"
              value={h.insulinDependent}
              onChange={(v) => setHealth({ insulinDependent: v })}
            />
          )}
        </SubGroup>

        <Toggle
          label="Tem hipertensão"
          value={h.hasHypertension}
          onChange={(v) => setHealth({ hasHypertension: v })}
        />

        <HealthQuestion
          label="Já passou por algum tipo de dependência?"
          hint="Sentimos cuidar disso com você. Não fica registrado em lugar nenhum acessível ao público."
          value={h.hasAddiction}
          onValueChange={(v) => setHealth({ hasAddiction: v })}
          detail={h.addictionDetail}
          onDetailChange={(v) => setHealth({ addictionDetail: v })}
        />
        <HealthQuestion
          label="Tem alguma restrição alimentar?"
          hint="Vegetariano, lactose, glúten, intolerâncias."
          value={h.hasDietaryRestriction}
          onValueChange={(v) => setHealth({ hasDietaryRestriction: v })}
          detail={h.dietaryRestrictionDetail}
          onDetailChange={(v) => setHealth({ dietaryRestrictionDetail: v })}
          detailPlaceholder="Conte direito pra cozinha conseguir cuidar."
        />

        <Separator variant="ornament" className="my-3" />

        <SubGroup label="Plano de saúde">
          <Toggle
            label="Tem plano"
            value={h.hasHealthInsurance}
            onChange={(v) => setHealth({ hasHealthInsurance: v })}
          />
          {h.hasHealthInsurance && (
            <div className="grid gap-3 px-4 pb-4">
              <Field label={<Label>Operadora</Label>}>
                <Input
                  value={h.healthInsuranceName}
                  onChange={(e) => setHealth({ healthInsuranceName: e.target.value })}
                  placeholder="Unimed, Amil, etc."
                />
              </Field>
              <Field label={<Label>Titular</Label>}>
                <Input
                  value={h.healthInsuranceHolder}
                  onChange={(e) => setHealth({ healthInsuranceHolder: e.target.value })}
                  placeholder="Em nome de quem"
                />
              </Field>
            </div>
          )}
        </SubGroup>

        <Field
          label={<Label htmlFor="meds">Medicações contínuas</Label>}
          hint="Liste o que você toma todo dia, com a dose."
        >
          <Textarea
            id="meds"
            value={h.continuousMedications}
            onChange={(e) => setHealth({ continuousMedications: e.target.value })}
            placeholder="Ex.: Levotiroxina 50mcg, jejum"
          />
        </Field>

        <Field label={<Label htmlFor="obs">Observações gerais</Label>} optional>
          <Textarea
            id="obs"
            value={h.generalObservations}
            onChange={(e) => setHealth({ generalObservations: e.target.value })}
            placeholder="Algo que a equipe deva saber"
          />
        </Field>
      </div>
    </CadastroFrame>
  );
}

function SubGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) overflow-hidden">
      <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
        {label}
      </p>
      <div className="grid divide-y divide-(color:--color-border)">{children}</div>
    </div>
  );
}

function Toggle({
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
