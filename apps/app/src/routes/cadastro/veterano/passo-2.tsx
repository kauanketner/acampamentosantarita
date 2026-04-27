import { createFileRoute } from '@tanstack/react-router';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/ui/masked-input';
import { useCadastroStore } from '@/lib/cadastro-store';

export const Route = createFileRoute('/cadastro/veterano/passo-2')({
  component: PassoDois,
});

function PassoDois() {
  const s = useCadastroStore();
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
          <MaskedInput
            id="zip"
            mask="cep"
            value={s.zipCode}
            onValueChange={(_f, raw) => s.set('zipCode', raw)}
          />
        </Field>
        <Field label={<Label htmlFor="street">Rua</Label>}>
          <Input
            id="street"
            value={s.street}
            onChange={(e) => s.set('street', e.target.value)}
            placeholder="Av. das Acácias"
          />
        </Field>
        <FieldRow>
          <Field label={<Label htmlFor="num">Número</Label>}>
            <Input
              id="num"
              inputMode="numeric"
              value={s.addressNumber}
              onChange={(e) => s.set('addressNumber', e.target.value)}
              placeholder="120"
            />
          </Field>
          <Field label={<Label htmlFor="comp">Complemento</Label>} optional>
            <Input
              id="comp"
              value={s.addressComplement}
              onChange={(e) => s.set('addressComplement', e.target.value)}
              placeholder="apto 401"
            />
          </Field>
        </FieldRow>
        <Field label={<Label htmlFor="bairro">Bairro</Label>}>
          <Input
            id="bairro"
            value={s.neighborhood}
            onChange={(e) => s.set('neighborhood', e.target.value)}
            placeholder="Funcionários"
          />
        </Field>
        <FieldRow>
          <Field label={<Label htmlFor="city">Cidade</Label>}>
            <Input
              id="city"
              value={s.city}
              onChange={(e) => s.set('city', e.target.value)}
              placeholder="Caieiras"
            />
          </Field>
          <Field label={<Label htmlFor="state">UF</Label>}>
            <Input
              id="state"
              value={s.state}
              onChange={(e) => s.set('state', e.target.value.toUpperCase().slice(0, 2))}
              maxLength={2}
              className="uppercase"
              placeholder="SP"
            />
          </Field>
        </FieldRow>
      </div>
    </CadastroFrame>
  );
}
