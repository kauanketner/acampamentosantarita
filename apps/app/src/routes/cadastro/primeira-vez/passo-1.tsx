import { createFileRoute } from '@tanstack/react-router';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioCard, RadioGroup } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-1')({
  component: PassoUm,
});

function PassoUm() {
  const [gender, setGender] = useState<string>('');
  return (
    <CadastroFrame
      step={1}
      total={5}
      variant="primeira-vez"
      eyebrow="Passo 1 — Sobre você"
      title={<>Conte um pouco de quem é você.</>}
      description="Os básicos. Tudo é confidencial e usado só para cuidar de você no evento."
      ctaTo="/cadastro/primeira-vez/passo-2"
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

        <FieldRow>
          <Field label={<Label htmlFor="birth">Nascimento</Label>}>
            <Input id="birth" type="date" />
          </Field>
          <Field label={<Label htmlFor="cpf">CPF</Label>}>
            <Input id="cpf" inputMode="numeric" placeholder="000.000.000-00" />
          </Field>
        </FieldRow>

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
