import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/form/Field';
import { HealthQuestion } from '@/components/form/HealthQuestion';
import { Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const Route = createFileRoute('/_auth/perfil/saude')({
  component: PerfilSaude,
});

function PerfilSaude() {
  const [hasAllergy, setHasAllergy] = useState(true);
  const [allergyDetail, setAllergyDetail] = useState('Penicilina — reação cutânea');
  const [hasDietary, setHasDietary] = useState(true);
  const [dietaryDetail, setDietaryDetail] = useState('Vegetariana');
  const [hasChronic, setHasChronic] = useState(false);
  const [chronicDetail, setChronicDetail] = useState('');
  const [meds, setMeds] = useState('Levotiroxina 50mcg, jejum');
  const [obs, setObs] = useState('');
  const [hasAsthma, setHasAsthma] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);

  return (
    <Page>
      <TopBar back="/perfil" title="Saúde" border />

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
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(color:--color-accent-soft) text-(color:--color-accent-foreground)">
          <ShieldCheck className="size-3.5" strokeWidth={1.8} />
          <span className="font-mono text-[10px] uppercase tracking-wider">
            Última revisão · 14 dias atrás
          </span>
        </div>
      </div>

      <SectionTitle>Em geral</SectionTitle>
      <div className="px-5 grid gap-2.5">
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
      </div>

      <SectionTitle>Condições</SectionTitle>
      <div className="px-5">
        <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) divide-y divide-(color:--color-border)">
          <SimpleToggle label="Asma" value={hasAsthma} onChange={setHasAsthma} />
          <SimpleToggle label="Diabetes" value={hasDiabetes} onChange={setHasDiabetes} />
          <SimpleToggle
            label="Hipertensão"
            value={hasHypertension}
            onChange={setHasHypertension}
          />
        </div>
      </div>

      <SectionTitle>Medicações & observações</SectionTitle>
      <div className="px-5 pb-32 grid gap-4">
        <Field label={<Label htmlFor="meds">Medicações contínuas</Label>}>
          <Textarea id="meds" value={meds} onChange={(e) => setMeds(e.target.value)} />
        </Field>
        <Field label={<Label htmlFor="obs">Observações</Label>} optional>
          <Textarea
            id="obs"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Algo que a equipe deva saber"
          />
        </Field>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-20 px-5 pt-3 pb-2 bg-gradient-to-t from-(color:--color-background) via-(color:--color-background)/90 to-transparent grid gap-2">
        <Button block size="lg">
          Salvar e atualizar revisão
        </Button>
        <Button variant="ghost" size="sm">
          <CheckCircle2 className="size-4" /> Tudo está como antes
        </Button>
      </div>
    </Page>
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
