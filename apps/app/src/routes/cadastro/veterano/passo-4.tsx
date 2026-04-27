import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field } from '@/components/form/Field';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';

const SACRAMENTS = [
  { id: 'batismo', label: 'Batismo' },
  { id: 'eucaristia', label: 'Eucaristia' },
  { id: 'crisma', label: 'Crisma' },
  { id: 'matrimonio', label: 'Matrimônio' },
  { id: 'ordem', label: 'Ordem' },
  { id: 'uncao_enfermos', label: 'Unção dos enfermos' },
  { id: 'confissao', label: 'Confissão' },
];

export const Route = createFileRoute('/cadastro/veterano/passo-4')({
  component: PassoQuatro,
});

function PassoQuatro() {
  const [selected, setSelected] = useState<string[]>(['batismo', 'eucaristia', 'crisma']);

  return (
    <CadastroFrame
      step={4}
      total={6}
      variant="veterano"
      eyebrow="Passo 4 — Vida de fé"
      title="Onde sua fé mora."
      ctaTo="/cadastro/veterano/passo-5"
    >
      <div className="grid gap-5">
        <Field label={<Label htmlFor="religion">Religião</Label>}>
          <Input id="religion" placeholder="Católica romana" />
        </Field>
        <Field label={<Label htmlFor="parish">Paróquia</Label>} optional>
          <Input id="parish" placeholder="Paróquia Santa Rita de Cássia" />
        </Field>
        <Field label={<Label htmlFor="group">Grupo de oração</Label>} optional>
          <Input id="group" placeholder="Pastoral da juventude" />
        </Field>

        <div>
          <p className="text-sm font-medium tracking-tight mb-2">Sacramentos recebidos</p>
          <div className="grid gap-1.5">
            {SACRAMENTS.map((s) => {
              const checked = selected.includes(s.id);
              return (
                <label
                  key={s.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-(--radius-md) border cursor-pointer transition-colors',
                    checked
                      ? 'border-(color:--color-primary) bg-(color:--color-primary-soft)'
                      : 'border-(color:--color-border) bg-(color:--color-surface) hover:bg-(color:--color-muted)',
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) =>
                      setSelected(v ? [...selected, s.id] : selected.filter((x) => x !== s.id))
                    }
                  />
                  <span className="text-[15px] font-medium">{s.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </CadastroFrame>
  );
}
