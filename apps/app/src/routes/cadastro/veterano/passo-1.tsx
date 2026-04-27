import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/ui/masked-input';
import { DatePicker } from '@/components/ui/date-picker';
import { RadioCard, RadioGroup } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Route = createFileRoute('/cadastro/veterano/passo-1')({
  component: PassoUm,
});

function PassoUm() {
  const [gender, setGender] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [birth, setBirth] = useState<Date | undefined>();
  return (
    <CadastroFrame
      step={1}
      total={6}
      variant="veterano"
      eyebrow="Passo 1 — De volta"
      title={<>Confirme quem é <span className="font-display-italic">você.</span></>}
      description="Seus dados ajudam a equipe a te encontrar e cuidar bem de você."
      ctaTo="/cadastro/veterano/passo-2"
    >
      <div className="grid gap-5">
        <Field label={<Label htmlFor="fullName">Nome completo</Label>}>
          <Input id="fullName" autoComplete="name" placeholder="Como aparece no documento" />
        </Field>

        <Field label="Sexo">
          <RadioGroup value={gender} onValueChange={setGender} className="grid-cols-2 grid">
            <RadioCard value="masculino" checked={gender === 'masculino'}>
              <p className="font-medium">Masculino</p>
            </RadioCard>
            <RadioCard value="feminino" checked={gender === 'feminino'}>
              <p className="font-medium">Feminino</p>
            </RadioCard>
          </RadioGroup>
        </Field>

        <Field label={<Label htmlFor="birth">Data de nascimento</Label>}>
          <DatePicker id="birth" value={birth} onChange={setBirth} />
        </Field>
        <Field label={<Label htmlFor="cpf">CPF</Label>}>
          <MaskedInput
            id="cpf"
            mask="cpf"
            value={cpf}
            onValueChange={(v) => setCpf(v)}
          />
        </Field>

        <Field label="Estado civil">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="uniao_estavel">União estável</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <FieldRow>
          <Field label={<Label htmlFor="height">Altura (cm)</Label>}>
            <Input id="height" inputMode="numeric" placeholder="170" />
          </Field>
          <Field label={<Label htmlFor="weight">Peso (kg)</Label>}>
            <Input id="weight" inputMode="decimal" placeholder="65,5" />
          </Field>
        </FieldRow>

        <Field label="Tamanho de camiseta">
          <div className="grid grid-cols-7 gap-2">
            {(['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'] as const).map((s) => (
              <label
                key={s}
                className="relative flex items-center justify-center h-11 rounded-(--radius-sm) border border-(color:--color-border-strong) bg-(color:--color-surface) text-sm font-medium cursor-pointer hover:bg-(color:--color-muted) has-checked:border-(color:--color-primary) has-checked:bg-(color:--color-primary-soft) has-checked:text-(color:--color-primary) transition"
              >
                <input type="radio" name="shirt" value={s} className="sr-only peer" />
                {s}
              </label>
            ))}
          </div>
        </Field>
      </div>
    </CadastroFrame>
  );
}
