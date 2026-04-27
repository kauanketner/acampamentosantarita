import { createFileRoute } from '@tanstack/react-router';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CadastroFrame } from '@/components/cadastro/CadastroFrame';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardBody } from '@/components/ui/card';
import { MaskedInput } from '@/components/ui/masked-input';

type Contact = { id: string; name: string; relationship: string; phone: string };

export const Route = createFileRoute('/cadastro/veterano/passo-3')({
  component: PassoTres,
});

function PassoTres() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'c1', name: '', relationship: '', phone: '' },
    { id: 'c2', name: '', relationship: '', phone: '' },
  ]);

  return (
    <CadastroFrame
      step={3}
      total={6}
      variant="veterano"
      eyebrow="Passo 3 — Contatos de emergência"
      title="A quem ligamos se algo acontecer?"
      description="No mínimo 2, no máximo 3. Pessoas próximas a você."
      ctaTo="/cadastro/veterano/passo-4"
    >
      <div className="grid gap-3">
        {contacts.map((c, i) => (
          <Card key={c.id}>
            <CardBody>
              <div className="flex items-baseline justify-between mb-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                  Contato {i + 1}
                </p>
                {contacts.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setContacts(contacts.filter((x) => x.id !== c.id))}
                    className="size-7 inline-flex items-center justify-center rounded-full text-(color:--color-muted-foreground) hover:bg-(color:--color-muted) hover:text-(color:--color-destructive) transition"
                    aria-label="Remover"
                  >
                    <Trash2 className="size-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>
              <div className="grid gap-3">
                <Field label={<Label>Nome</Label>}>
                  <Input
                    value={c.name}
                    onChange={(e) =>
                      setContacts((prev) =>
                        prev.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)),
                      )
                    }
                    placeholder="Maria das Dores"
                  />
                </Field>
                <FieldRow>
                  <Field label={<Label>Parentesco</Label>}>
                    <Input
                      value={c.relationship}
                      onChange={(e) =>
                        setContacts((prev) =>
                          prev.map((x) =>
                            x.id === c.id ? { ...x, relationship: e.target.value } : x,
                          ),
                        )
                      }
                      placeholder="mãe"
                    />
                  </Field>
                  <Field label={<Label>Telefone</Label>}>
                    <MaskedInput
                      mask="phone"
                      value={c.phone}
                      onValueChange={(v) =>
                        setContacts((prev) =>
                          prev.map((x) => (x.id === c.id ? { ...x, phone: v } : x)),
                        )
                      }
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
            onClick={() =>
              setContacts([
                ...contacts,
                { id: `c${contacts.length + 1}`, name: '', relationship: '', phone: '' },
              ])
            }
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
