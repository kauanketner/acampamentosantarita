import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
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

export const Route = createFileRoute('/cadastro/veterano/passo-1')({
  component: PassoUm,
});

type Size = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG' | '';

function PassoUm() {
  const [gender, setGender] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [birth, setBirth] = useState<Date | undefined>();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [shirt, setShirt] = useState<Size>('');

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
      <div className="grid gap-6">
        <PhotoUpload
          variant="avatar"
          size="lg"
          name={name}
          onChange={setAvatar}
          hint="Use uma foto sua. Ajuda a equipe te reconhecer."
        />

        <Field label={<Label htmlFor="fullName">Nome completo</Label>}>
          <Input
            id="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Como aparece no documento"
          />
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
          <MaskedInput id="cpf" mask="cpf" value={cpf} onValueChange={(v) => setCpf(v)} />
        </Field>

        <Field
          label={<Label htmlFor="phone">Celular</Label>}
          hint="WhatsApp preferencialmente."
        >
          <MaskedInput
            id="phone"
            mask="phone"
            value={phone}
            onValueChange={(v) => setPhone(v)}
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
          <ShirtSizePicker value={shirt} onChange={(s) => setShirt(s)} />
        </Field>
      </div>
      {avatar && null}
    </CadastroFrame>
  );
}
