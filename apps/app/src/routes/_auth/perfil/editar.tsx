import { createFileRoute } from '@tanstack/react-router';
import { Camera } from 'lucide-react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field, FieldRow } from '@/components/form/Field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { me } from '@/mock/data';

export const Route = createFileRoute('/_auth/perfil/editar')({
  component: PerfilEditar,
});

function PerfilEditar() {
  return (
    <Page>
      <TopBar back="/perfil" title="Dados pessoais" border />

      {/* avatar */}
      <div className="px-5 pt-6 pb-8 flex flex-col items-center">
        <div className="relative">
          <Avatar name={me.fullName} size="xl" ringed={me.isVeteran} />
          <button
            type="button"
            className="absolute -bottom-1 -right-1 size-9 rounded-full bg-(color:--color-primary) text-(color:--color-primary-foreground) inline-flex items-center justify-center shadow-md"
            aria-label="Trocar foto"
          >
            <Camera className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        <p className="mt-3 text-sm text-(color:--color-muted-foreground)">Trocar foto</p>
      </div>

      <SectionTitle>Pessoa</SectionTitle>
      <div className="px-5 grid gap-4">
        <Field label={<Label>Nome completo</Label>}>
          <Input defaultValue={me.fullName} />
        </Field>
        <FieldRow>
          <Field label={<Label>CPF</Label>}>
            <Input defaultValue="036.872.140-12" />
          </Field>
          <Field label={<Label>Camiseta</Label>}>
            <Input defaultValue={me.shirtSize} maxLength={3} />
          </Field>
        </FieldRow>
      </div>

      <SectionTitle>Endereço</SectionTitle>
      <div className="px-5 grid gap-4">
        <Field label={<Label>Cidade</Label>}>
          <Input defaultValue={me.city} />
        </Field>
        <FieldRow>
          <Field label={<Label>Estado</Label>}>
            <Input defaultValue={me.state} maxLength={2} className="uppercase" />
          </Field>
          <Field label={<Label>Celular</Label>}>
            <Input defaultValue="(31) 99999-0000" inputMode="tel" />
          </Field>
        </FieldRow>
      </div>

      <SectionTitle>Contatos de emergência</SectionTitle>
      <div className="px-5 pb-32 grid gap-3">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground) mb-2">
              Contato {n}
            </p>
            <div className="grid gap-3">
              <Field label={<Label>Nome</Label>}>
                <Input defaultValue={n === 1 ? 'João Almeida' : 'Carla Lopes'} />
              </Field>
              <FieldRow>
                <Field label={<Label>Parentesco</Label>}>
                  <Input defaultValue={n === 1 ? 'pai' : 'irmã'} />
                </Field>
                <Field label={<Label>Telefone</Label>}>
                  <Input defaultValue={n === 1 ? '(31) 98888-1111' : '(31) 97777-2222'} />
                </Field>
              </FieldRow>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-20 px-5 pt-3 pb-2 bg-gradient-to-t from-(color:--color-background) via-(color:--color-background)/90 to-transparent">
        <Button block size="lg">
          Salvar
        </Button>
      </div>
    </Page>
  );
}
