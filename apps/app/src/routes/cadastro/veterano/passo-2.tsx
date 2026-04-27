import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/ui/masked-input';

export const Route = createFileRoute('/cadastro/veterano/passo-2')({
  component: PassoDois,
});

function PassoDois() {
  const [cep, setCep] = useState('');
  return (
    <CadastroFrame
      step={2}
      total={6}
      variant="veterano"
      eyebrow="Passo 2 — Endereço"
      title="Para onde mandamos as notícias."
      ctaTo="/cadastro/veterano/passo-3"
    >
      <div className="grid gap-5">
        <Field label={<Label htmlFor="zip">CEP</Label>}>
          <MaskedInput id="zip" mask="cep" value={cep} onValueChange={(v) => setCep(v)} />
        </Field>
        <Field label={<Label htmlFor="street">Rua</Label>}>
          <Input id="street" placeholder="Av. das Acácias" />
        </Field>
        <FieldRow>
          <Field label={<Label htmlFor="num">Número</Label>}>
            <Input id="num" inputMode="numeric" placeholder="120" />
          </Field>
          <Field label={<Label htmlFor="comp">Complemento</Label>} optional>
            <Input id="comp" placeholder="apto 401" />
          </Field>
        </FieldRow>
        <Field label={<Label htmlFor="bairro">Bairro</Label>}>
          <Input id="bairro" placeholder="Funcionários" />
        </Field>
        <FieldRow>
          <Field label={<Label htmlFor="city">Cidade</Label>}>
            <Input id="city" placeholder="Belo Horizonte" />
          </Field>
          <Field label={<Label htmlFor="state">UF</Label>}>
            <Input id="state" maxLength={2} className="uppercase" placeholder="MG" />
          </Field>
        </FieldRow>
      </div>
    </CadastroFrame>
  );
}
