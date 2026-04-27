import { createFileRoute } from '@tanstack/react-router';
import { Plus, Trash2 } from 'lucide-react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardBody } from '@/components/ui/card';
import { MaskedInput } from '@/components/ui/masked-input';
import { useCadastroStore } from '@/lib/cadastro-store';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-3')({
  component: PassoTres,
});

function PassoTres() {
  const contacts = useCadastroStore((s) => s.emergencyContacts);
  const set = useCadastroStore((s) => s.set);

  const updateContact = (id: string, patch: Partial<(typeof contacts)[number]>) => {
    set(
      'emergencyContacts',
      contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const remove = (id: string) =>
    set('emergencyContacts', contacts.filter((c) => c.id !== id));

  const add = () =>
    set('emergencyContacts', [
      ...contacts,
      { id: `c${Date.now()}`, name: '', relationship: '', phone: '' },
    ]);

  return (
    <CadastroFrame
      step={3}
      total={5}
      variant="primeira-vez"
      eyebrow="Passo 3 — Em caso de necessidade"
      title="A quem ligamos se algo acontecer?"
      description="No mínimo 2 contatos, no máximo 3. Pessoas próximas a você."
      ctaTo="/cadastro/primeira-vez/passo-4"
    >
      <div className="grid gap-3">
        {contacts.map((c, i) => (
          <Card key={c.id} variant="warmth">
            <CardBody>
              <div className="flex items-baseline justify-between mb-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                  Contato {i + 1}
                </p>
                {contacts.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="size-7 inline-flex items-center justify-center rounded-full text-(color:--color-muted-foreground) hover:bg-(color:--color-muted) hover:text-(color:--color-destructive) transition"
                    aria-label="Remover contato"
                  >
                    <Trash2 className="size-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>
              <div className="grid gap-3">
                <Field label={<Label>Nome</Label>}>
                  <Input
                    value={c.name}
                    onChange={(e) => updateContact(c.id, { name: e.target.value })}
                    placeholder="Maria das Dores"
                  />
                </Field>
                <FieldRow>
                  <Field label={<Label>Parentesco</Label>}>
                    <Input
                      value={c.relationship}
                      onChange={(e) =>
                        updateContact(c.id, { relationship: e.target.value })
                      }
                      placeholder="mãe"
                    />
                  </Field>
                  <Field label={<Label>Telefone</Label>}>
                    <MaskedInput
                      mask="phone"
                      value={c.phone}
                      onValueChange={(_f, raw) => updateContact(c.id, { phone: raw })}
                    />
                  </Field>
                </FieldRow>
              </div>
            </CardBody>
          </Card>
        ))}

        {contacts.length < 3 && (
          <button
            type="button"
            onClick={add}
            className="rounded-(--radius-md) border-2 border-dashed border-(color:--color-border-strong) py-4 flex items-center justify-center gap-2 text-sm text-(color:--color-muted-foreground) hover:bg-(color:--color-muted) hover:text-(color:--color-foreground) transition"
          >
            <Plus className="size-4" strokeWidth={1.5} />
            Adicionar contato
          </button>
        )}
      </div>
    </CadastroFrame>
  );
}
