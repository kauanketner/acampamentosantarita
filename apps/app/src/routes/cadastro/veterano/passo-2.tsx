import { createFileRoute } from '@tanstack/react-router';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/cadastro/veterano/passo-2')({
  component: PassoDois,
});

function PassoDois() {
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
          <Input id="zip" inputMode="numeric" placeholder="00000-000" />
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
        <Field
          label={<Label htmlFor="phone">Celular</Label>}
          hint="WhatsApp preferencialmente."
        >
          <Input id="phone" inputMode="tel" placeholder="(31) 99999-0000" />
        </Field>
      </div>
    </CadastroFrame>
  );
}
