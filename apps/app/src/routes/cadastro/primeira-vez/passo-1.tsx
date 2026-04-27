import { createFileRoute } from '@tanstack/react-router';
import { format, parse } from 'date-fns';
import { useEffect } from 'react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { ShirtSizePicker } from '@/components/form/ShirtSizePicker';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/ui/masked-input';
import { PhotoUpload } from '@/components/ui/photo-upload';
import { RadioCard, RadioGroup } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCadastroStore } from '@/lib/cadastro-store';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-1')({
  component: PassoUm,
});

function PassoUm() {
  const s = useCadastroStore();

  // Garante que a variant esteja marcada — caso o usuário entre direto pela URL
  useEffect(() => {
    if (s.variant !== 'primeira-vez') s.setVariant('primeira-vez');
  }, [s.variant, s.setVariant]);

  const birthDate = s.birthDate
    ? parse(s.birthDate, 'yyyy-MM-dd', new Date())
    : undefined;

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
      <div className="grid gap-6">
        <PhotoUpload
          variant="avatar"
          size="lg"
          name={s.fullName}
          onChange={(f) => s.set('avatarFile', f)}
          hint="Use uma foto sua. Ajuda a equipe te reconhecer."
        />

        <Field label={<Label htmlFor="fullName">Nome completo</Label>}>
          <Input
            id="fullName"
            value={s.fullName}
            onChange={(e) => s.set('fullName', e.target.value)}
            autoComplete="name"
            placeholder="Como aparece no documento"
          />
        </Field>

        <Field label="Sexo">
          <RadioGroup
            value={s.gender}
            onValueChange={(v) => s.set('gender', v as typeof s.gender)}
            className="grid-cols-2 grid"
          >
            <RadioCard value="masculino" checked={s.gender === 'masculino'}>
              <p className="font-medium">Masculino</p>
            </RadioCard>
            <RadioCard value="feminino" checked={s.gender === 'feminino'}>
              <p className="font-medium">Feminino</p>
            </RadioCard>
          </RadioGroup>
        </Field>

        <Field label={<Label htmlFor="birth">Data de nascimento</Label>}>
          <DatePicker
            id="birth"
            value={birthDate}
            onChange={(d) => s.set('birthDate', d ? format(d, 'yyyy-MM-dd') : '')}
          />
        </Field>

        <Field label={<Label htmlFor="cpf">CPF</Label>}>
          <MaskedInput
            id="cpf"
            mask="cpf"
            value={s.cpf}
            onValueChange={(_formatted, raw) => s.set('cpf', raw)}
          />
        </Field>

        <Field
          label={<Label htmlFor="phone">Celular</Label>}
          hint="WhatsApp preferencialmente. Usado para mensagens da comunidade."
        >
          <MaskedInput
            id="phone"
            mask="phone"
            value={s.phone}
            onValueChange={(_formatted, raw) => s.set('phone', raw)}
          />
        </Field>

        <Field label="Estado civil">
          <Select
            value={s.maritalStatus}
            onValueChange={(v) => s.set('maritalStatus', v as typeof s.maritalStatus)}
          >
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
            <Input
              id="height"
              inputMode="numeric"
              placeholder="170"
              value={s.heightCm}
              onChange={(e) => s.set('heightCm', e.target.value.replace(/\D/g, ''))}
            />
          </Field>
          <Field label={<Label htmlFor="weight">Peso (kg)</Label>}>
            <Input
              id="weight"
              inputMode="decimal"
              placeholder="65,5"
              value={s.weightKg}
              onChange={(e) => s.set('weightKg', e.target.value.replace(/[^\d,.]/g, ''))}
            />
          </Field>
        </FieldRow>

        <Field label="Tamanho de camiseta">
          <ShirtSizePicker value={s.shirtSize} onChange={(v) => s.set('shirtSize', v)} />
        </Field>
      </div>
    </CadastroFrame>
  );
}
