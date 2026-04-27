import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/form/Field';
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

export const Route = createFileRoute('/_auth/perfil/fe')({
  component: PerfilFe,
});

function PerfilFe() {
  const [selected, setSelected] = useState<string[]>(['batismo', 'eucaristia', 'crisma']);

  return (
    <Page>
      <TopBar back="/perfil" title="Vida de fé" border />

      <div className="px-5 pt-4 pb-2">
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Vida de <span className="font-display-italic">fé.</span>
        </h1>
      </div>

      <SectionTitle>Comunidade</SectionTitle>
      <div className="px-5 grid gap-4">
        <Field label={<Label>Religião</Label>}>
          <Input defaultValue="Católica romana" />
        </Field>
        <Field label={<Label>Paróquia</Label>} optional>
          <Input defaultValue="Paróquia Santa Rita de Cássia" />
        </Field>
        <Field label={<Label>Grupo de oração</Label>} optional>
          <Input defaultValue="Pastoral da juventude" />
        </Field>
      </div>

      <SectionTitle>Sacramentos recebidos</SectionTitle>
      <div className="px-5 pb-32 grid gap-1.5">
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

      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-20 px-5 pt-3 pb-2 bg-gradient-to-t from-(color:--color-background) via-(color:--color-background)/90 to-transparent">
        <Button block size="lg">
          Salvar
        </Button>
      </div>
    </Page>
  );
}
