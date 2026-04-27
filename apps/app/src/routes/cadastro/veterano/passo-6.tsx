import { createFileRoute } from '@tanstack/react-router';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardBody } from '@/components/ui/card';
import { RadioCard, RadioGroup } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Route = createFileRoute('/cadastro/veterano/passo-6')({
  component: PassoSeis,
});

type Participation = {
  id: string;
  edition: string;
  role: 'campista' | 'equipista' | 'lider' | '';
  tribeName: string;
  serviceTeam: string;
  functionRole: string;
};

const blank = (): Participation => ({
  id: Math.random().toString(36).slice(2),
  edition: '',
  role: '',
  tribeName: '',
  serviceTeam: '',
  functionRole: '',
});

function PassoSeis() {
  const [list, setList] = useState<Participation[]>([blank()]);

  const setItem = (id: string, patch: Partial<Participation>) =>
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remove = (id: string) => setList((prev) => prev.filter((p) => p.id !== id));
  const add = () => setList((prev) => [...prev, blank()]);

  return (
    <CadastroFrame
      step={6}
      total={6}
      variant="veterano"
      eyebrow="Passo 6 — Sua história"
      title={
        <>
          De quais acampamentos você
          <br />
          <span className="font-display-italic">já participou?</span>
        </>
      }
      description="Conte a quantas edições você foi — em alguma como campista, em outra servindo, em outra liderando. Isso preserva a memória da comunidade."
      ctaTo="/cadastro/veterano/concluido"
      ctaLabel="Concluir cadastro"
    >
      <div className="grid gap-3">
        {list.map((p, i) => (
          <Card key={p.id}>
            <CardBody>
              <div className="flex items-baseline justify-between mb-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                  Participação {String(i + 1).padStart(2, '0')}
                </p>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="size-7 inline-flex items-center justify-center rounded-full text-(color:--color-muted-foreground) hover:bg-(color:--color-muted) hover:text-(color:--color-destructive) transition"
                  aria-label="Remover"
                >
                  <Trash2 className="size-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="grid gap-4">
                <Field label={<Label>Edição</Label>}>
                  <Select
                    value={p.edition}
                    onValueChange={(v) => setItem(p.id, { edition: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha entre o 1º e o 13º" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 13 }, (_, idx) => 13 - idx).map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}º acampamento
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Você foi…">
                  <RadioGroup
                    value={p.role}
                    onValueChange={(v) =>
                      setItem(p.id, { role: v as Participation['role'] })
                    }
                    className="grid grid-cols-3 gap-2"
                  >
                    <RadioCard value="campista" checked={p.role === 'campista'}>
                      <p className="font-medium text-sm">Campista</p>
                    </RadioCard>
                    <RadioCard value="equipista" checked={p.role === 'equipista'}>
                      <p className="font-medium text-sm">Equipista</p>
                    </RadioCard>
                    <RadioCard value="lider" checked={p.role === 'lider'}>
                      <p className="font-medium text-sm">Líder</p>
                    </RadioCard>
                  </RadioGroup>
                </Field>

                {(p.role === 'campista' || p.role === 'lider') && (
                  <Field
                    label={<Label>Tribo</Label>}
                    hint="Pode escrever em texto livre se ainda não estiver cadastrada."
                  >
                    <Input
                      value={p.tribeName}
                      onChange={(e) => setItem(p.id, { tribeName: e.target.value })}
                      placeholder="Ex.: Tribo do Cedro"
                    />
                  </Field>
                )}

                {p.role === 'equipista' && (
                  <FieldRow>
                    <Field label={<Label>Equipe</Label>}>
                      <Input
                        value={p.serviceTeam}
                        onChange={(e) => setItem(p.id, { serviceTeam: e.target.value })}
                        placeholder="Cozinha"
                      />
                    </Field>
                    <Field label={<Label>Função</Label>} optional>
                      <Input
                        value={p.functionRole}
                        onChange={(e) => setItem(p.id, { functionRole: e.target.value })}
                        placeholder="coordenadora"
                      />
                    </Field>
                  </FieldRow>
                )}
              </div>
            </CardBody>
          </Card>
        ))}

        <button
          type="button"
          onClick={add}
          className="rounded-(--radius-md) border-2 border-dashed border-(color:--color-border-strong) py-4 flex items-center justify-center gap-2 text-sm text-(color:--color-muted-foreground) hover:bg-(color:--color-muted) hover:text-(color:--color-foreground) transition"
        >
          <Plus className="size-4" strokeWidth={1.5} />
          Adicionar mais uma edição
        </button>
      </div>
    </CadastroFrame>
  );
}
