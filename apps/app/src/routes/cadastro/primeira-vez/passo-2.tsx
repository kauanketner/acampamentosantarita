import { createFileRoute } from '@tanstack/react-router';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-2')({
  component: PassoDois,
});

function PassoDois() {
  return (
    <CadastroFrame
      step={2}
      total={5}
      variant="primeira-vez"
      eyebrow="Passo 2 — Onde você mora"
      title={<>Para onde mandamos as <span className="font-display-italic">notícias</span>.</>}
      description="Endereço para casos administrativos e correspondências da comunidade."
      ctaTo="/cadastro/primeira-vez/passo-3"
    >
      <div className="grid gap-5">
        <Field label={<Label htmlFor="zip">CEP</Label>}>
          <Input id="zip" inputMode="numeric" placeholder="00000-000" />
        </Field>

        <Field label={<Label htmlFor="street">Rua</Label>}>
          <Input id="street" autoComplete="street-address" placeholder="Av. das Acácias" />
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
            <Input id="city" autoComplete="address-level2" placeholder="Belo Horizonte" />
          </Field>
          <Field label={<Label htmlFor="state">UF</Label>}>
            <Input id="state" maxLength={2} className="uppercase" placeholder="MG" />
          </Field>
        </FieldRow>

        <Field
          label={<Label htmlFor="phone">Celular</Label>}
          hint="WhatsApp preferencialmente. Usado para mensagens da comunidade."
        >
          <Input id="phone" inputMode="tel" autoComplete="tel" placeholder="(31) 99999-0000" />
        </Field>
      </div>
    </CadastroFrame>
  );
}
