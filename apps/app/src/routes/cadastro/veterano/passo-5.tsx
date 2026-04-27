import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field } from '@/components/form/Field';
import { HealthQuestion } from '@/components/form/HealthQuestion';
import { Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const Route = createFileRoute('/cadastro/veterano/passo-5')({
  component: PassoCinco,
});

function PassoCinco() {
  const [hasChronic, setHasChronic] = useState(false);
  const [chronicDetail, setChronicDetail] = useState('');
  const [hasAllergy, setHasAllergy] = useState(false);
  const [allergyDetail, setAllergyDetail] = useState('');
  const [hasDietary, setHasDietary] = useState(false);
  const [dietaryDetail, setDietaryDetail] = useState('');
  const [hasAsthma, setHasAsthma] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [meds, setMeds] = useState('');
  const [obs, setObs] = useState('');

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
          value={hasChronic}
          onValueChange={setHasChronic}
          detail={chronicDetail}
          onDetailChange={setChronicDetail}
        />
        <HealthQuestion
          label="Tem alguma alergia?"
          value={hasAllergy}
          onValueChange={setHasAllergy}
          detail={allergyDetail}
          onDetailChange={setAllergyDetail}
        />
        <HealthQuestion
          label="Restrição alimentar?"
          value={hasDietary}
          onValueChange={setHasDietary}
          detail={dietaryDetail}
          onDetailChange={setDietaryDetail}
        />

        <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) divide-y divide-(color:--color-border)">
          <SimpleToggle label="Asma" value={hasAsthma} onChange={setHasAsthma} />
          <SimpleToggle label="Diabetes" value={hasDiabetes} onChange={setHasDiabetes} />
          <SimpleToggle
            label="Hipertensão"
            value={hasHypertension}
            onChange={setHasHypertension}
          />
        </div>

        <Field
          label={<Label htmlFor="meds">Medicações contínuas</Label>}
          hint="O que você toma todos os dias, com a dose."
        >
          <Textarea
            id="meds"
            value={meds}
            onChange={(e) => setMeds(e.target.value)}
            placeholder="Ex.: Levotiroxina 50mcg, jejum"
          />
        </Field>

        <Field label={<Label htmlFor="obs">Observações</Label>} optional>
          <Textarea
            id="obs"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
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
