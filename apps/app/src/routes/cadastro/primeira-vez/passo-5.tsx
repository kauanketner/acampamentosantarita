import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field } from '@/components/form/Field';
import { HealthQuestion } from '@/components/form/HealthQuestion';
import { Textarea, Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-5')({
  component: PassoCinco,
});

type Health = {
  hasChronic: boolean;
  chronicDetail: string;
  hadSurgery: boolean;
  surgeryDetail: string;
  hasAllergy: boolean;
  allergyDetail: string;
  hasAsthma: boolean;
  usesInhaler: boolean;
  hasDiabetes: boolean;
  insulinDependent: boolean;
  hasHypertension: boolean;
  hasAddiction: boolean;
  addictionDetail: string;
  hasDietary: boolean;
  dietaryDetail: string;
  hasInsurance: boolean;
  insuranceName: string;
  insuranceHolder: string;
  continuousMedications: string;
  observations: string;
};

const initial: Health = {
  hasChronic: false,
  chronicDetail: '',
  hadSurgery: false,
  surgeryDetail: '',
  hasAllergy: false,
  allergyDetail: '',
  hasAsthma: false,
  usesInhaler: false,
  hasDiabetes: false,
  insulinDependent: false,
  hasHypertension: false,
  hasAddiction: false,
  addictionDetail: '',
  hasDietary: false,
  dietaryDetail: '',
  hasInsurance: false,
  insuranceName: '',
  insuranceHolder: '',
  continuousMedications: '',
  observations: '',
};

function PassoCinco() {
  const [h, setH] = useState<Health>(initial);
  const set = <K extends keyof Health>(k: K, v: Health[K]) => setH((p) => ({ ...p, [k]: v }));

  return (
    <CadastroFrame
      step={5}
      total={5}
      variant="primeira-vez"
      eyebrow="Passo 5 — Para cuidarmos bem de você"
      title="Saúde."
      description="As respostas ficam confidenciais com a equipe de bem-estar e cozinha. Nada é compartilhado com outros participantes."
      ctaTo="/cadastro/primeira-vez/concluido"
      ctaLabel="Concluir cadastro"
    >
      <div className="grid gap-2.5">
        <HealthQuestion
          label="Você tem alguma doença crônica?"
          hint="Hipotireoidismo, fibromialgia, etc."
          value={h.hasChronic}
          onValueChange={(v) => set('hasChronic', v)}
          detail={h.chronicDetail}
          onDetailChange={(v) => set('chronicDetail', v)}
          detailPlaceholder="Conte qual e como tem cuidado."
        />
        <HealthQuestion
          label="Já passou por alguma cirurgia?"
          value={h.hadSurgery}
          onValueChange={(v) => set('hadSurgery', v)}
          detail={h.surgeryDetail}
          onDetailChange={(v) => set('surgeryDetail', v)}
          detailPlaceholder="Qual e quando."
        />
        <HealthQuestion
          label="Tem alguma alergia?"
          hint="Alimentar, medicamentosa, ambiental."
          value={h.hasAllergy}
          onValueChange={(v) => set('hasAllergy', v)}
          detail={h.allergyDetail}
          onDetailChange={(v) => set('allergyDetail', v)}
          detailPlaceholder="A que e qual a reação?"
        />

        <SubGroup label="Asma">
          <Toggle label="Tem asma" value={h.hasAsthma} onChange={(v) => set('hasAsthma', v)} />
          {h.hasAsthma && (
            <Toggle
              label="Usa bombinha"
              value={h.usesInhaler}
              onChange={(v) => set('usesInhaler', v)}
            />
          )}
        </SubGroup>

        <SubGroup label="Diabetes">
          <Toggle
            label="Tem diabetes"
            value={h.hasDiabetes}
            onChange={(v) => set('hasDiabetes', v)}
          />
          {h.hasDiabetes && (
            <Toggle
              label="É insulinodependente"
              value={h.insulinDependent}
              onChange={(v) => set('insulinDependent', v)}
            />
          )}
        </SubGroup>

        <Toggle
          label="Tem hipertensão"
          value={h.hasHypertension}
          onChange={(v) => set('hasHypertension', v)}
        />

        <HealthQuestion
          label="Já passou por algum tipo de dependência?"
          hint="Sentimos cuidar disso com você. Não fica registrado em lugar nenhum acessível ao público."
          value={h.hasAddiction}
          onValueChange={(v) => set('hasAddiction', v)}
          detail={h.addictionDetail}
          onDetailChange={(v) => set('addictionDetail', v)}
        />
        <HealthQuestion
          label="Tem alguma restrição alimentar?"
          hint="Vegetariano, lactose, glúten, intolerâncias."
          value={h.hasDietary}
          onValueChange={(v) => set('hasDietary', v)}
          detail={h.dietaryDetail}
          onDetailChange={(v) => set('dietaryDetail', v)}
          detailPlaceholder="Conte direito pra cozinha conseguir cuidar."
        />

        <Separator variant="ornament" className="my-3" />

        <SubGroup label="Plano de saúde">
          <Toggle
            label="Tem plano"
            value={h.hasInsurance}
            onChange={(v) => set('hasInsurance', v)}
          />
          {h.hasInsurance && (
            <div className="grid gap-3 px-4 pb-4">
              <Field label={<Label>Operadora</Label>}>
                <Input
                  value={h.insuranceName}
                  onChange={(e) => set('insuranceName', e.target.value)}
                  placeholder="Unimed, Amil, etc."
                />
              </Field>
              <Field label={<Label>Titular</Label>}>
                <Input
                  value={h.insuranceHolder}
                  onChange={(e) => set('insuranceHolder', e.target.value)}
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
            onChange={(e) => set('continuousMedications', e.target.value)}
            placeholder="Ex.: Levotiroxina 50mcg, jejum"
          />
        </Field>

        <Field label={<Label htmlFor="obs">Observações gerais</Label>} optional>
          <Textarea
            id="obs"
            value={h.observations}
            onChange={(e) => set('observations', e.target.value)}
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
