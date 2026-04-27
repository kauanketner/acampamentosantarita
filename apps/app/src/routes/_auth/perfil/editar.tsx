import { createFileRoute } from '@tanstack/react-router';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Field, FieldRow } from '@/components/form/Field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/ui/masked-input';
import { PhotoUpload } from '@/components/ui/photo-upload';
import { ApiError } from '@/lib/api';
import {
  mediaUrl,
  useFullProfile,
  useUpdateProfile,
  useUploadAvatar,
} from '@/lib/queries/profile';

export const Route = createFileRoute('/_auth/perfil/editar')({
  component: PerfilEditar,
});

type ContactDraft = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
};

type Form = {
  fullName: string;
  cpf: string;
  shirtSize: string;
  city: string;
  state: string;
  mobilePhone: string;
  zipCode: string;
  street: string;
  neighborhood: string;
  addressNumber: string;
  addressComplement: string;
  contacts: ContactDraft[];
};

function PerfilEditar() {
  const { data: profile, isLoading } = useFullProfile();
  const update = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [form, setForm] = useState<Form | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      fullName: profile.person.fullName ?? '',
      cpf: profile.person.cpf ?? '',
      shirtSize: profile.person.shirtSize ?? '',
      city: profile.person.city ?? '',
      state: profile.person.state ?? '',
      mobilePhone: profile.person.mobilePhone?.replace(/\D/g, '').replace(/^55/, '') ?? '',
      zipCode: profile.person.zipCode ?? '',
      street: profile.person.street ?? '',
      neighborhood: profile.person.neighborhood ?? '',
      addressNumber: profile.person.addressNumber ?? '',
      addressComplement: profile.person.addressComplement ?? '',
      contacts: profile.contacts.map((c) => ({
        id: c.id,
        name: c.name,
        relationship: c.relationship,
        phone: c.phone.replace(/\D/g, '').replace(/^55/, ''),
      })),
    });
  }, [profile]);

  if (isLoading || !form || !profile) {
    return (
      <Page>
        <TopBar back="/perfil" title="Dados pessoais" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  const setField = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((s) => (s ? { ...s, [key]: value } : s));

  const updateContact = (id: string, patch: Partial<ContactDraft>) =>
    setForm((s) =>
      s
        ? {
            ...s,
            contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          }
        : s,
    );

  const addContact = () =>
    setForm((s) =>
      s && s.contacts.length < 3
        ? {
            ...s,
            contacts: [
              ...s.contacts,
              {
                id: `tmp-${Date.now()}`,
                name: '',
                relationship: '',
                phone: '',
              },
            ],
          }
        : s,
    );

  const removeContact = (id: string) =>
    setForm((s) =>
      s && s.contacts.length > 2
        ? { ...s, contacts: s.contacts.filter((c) => c.id !== id) }
        : s,
    );

  const handleAvatar = async (file: File | null) => {
    if (!file) return;
    setError(null);
    try {
      await uploadAvatar.mutateAsync(file);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível atualizar a foto.',
      );
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError(null);
    setSavedNotice(false);

    const validContacts = form.contacts.filter(
      (c) => c.name.trim() && c.phone.length >= 10,
    );
    if (validContacts.length < 2) {
      setError('Mantenha pelo menos 2 contatos de emergência preenchidos.');
      return;
    }

    try {
      await update.mutateAsync({
        fullName: form.fullName.trim(),
        cpf: form.cpf || null,
        shirtSize:
          (form.shirtSize as 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG' | '') || null,
        city: form.city.trim() || null,
        state: form.state ? form.state.toUpperCase() : null,
        mobilePhone: form.mobilePhone,
        zipCode: form.zipCode || null,
        street: form.street.trim() || null,
        neighborhood: form.neighborhood.trim() || null,
        addressNumber: form.addressNumber.trim() || null,
        addressComplement: form.addressComplement.trim() || null,
        emergencyContacts: validContacts.map((c) => ({
          name: c.name.trim(),
          relationship: c.relationship.trim() || '—',
          phone: c.phone,
        })),
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  const avatarSrc = mediaUrl(profile.person.avatarUrl);

  return (
    <Page>
      <TopBar back="/perfil" title="Dados pessoais" border />

      <form onSubmit={onSubmit}>
        {/* avatar */}
        <div className="px-5 pt-6 pb-8 flex flex-col items-center">
          <PhotoUpload
            variant="avatar"
            size="xl"
            value={avatarSrc}
            name={form.fullName}
            onChange={handleAvatar}
            disabled={uploadAvatar.isPending}
            hint={uploadAvatar.isPending ? 'Enviando…' : undefined}
          />
        </div>

        <SectionTitle>Pessoa</SectionTitle>
        <div className="px-5 grid gap-4">
          <Field label={<Label>Nome completo</Label>}>
            <Input
              value={form.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
            />
          </Field>
          <FieldRow>
            <Field label={<Label>CPF</Label>}>
              <MaskedInput
                mask="cpf"
                value={form.cpf}
                onValueChange={(_f, raw) => setField('cpf', raw)}
              />
            </Field>
            <Field label={<Label>Camiseta</Label>}>
              <Input
                value={form.shirtSize}
                onChange={(e) =>
                  setField('shirtSize', e.target.value.toUpperCase().slice(0, 3))
                }
                maxLength={3}
              />
            </Field>
          </FieldRow>
        </div>

        <SectionTitle>Endereço</SectionTitle>
        <div className="px-5 grid gap-4">
          <FieldRow>
            <Field label={<Label>CEP</Label>}>
              <MaskedInput
                mask="cep"
                value={form.zipCode}
                onValueChange={(_f, raw) => setField('zipCode', raw)}
              />
            </Field>
            <Field label={<Label>Número</Label>}>
              <Input
                value={form.addressNumber}
                onChange={(e) => setField('addressNumber', e.target.value)}
              />
            </Field>
          </FieldRow>
          <Field label={<Label>Rua</Label>}>
            <Input
              value={form.street}
              onChange={(e) => setField('street', e.target.value)}
            />
          </Field>
          <Field label={<Label>Bairro</Label>}>
            <Input
              value={form.neighborhood}
              onChange={(e) => setField('neighborhood', e.target.value)}
            />
          </Field>
          <Field label={<Label>Complemento</Label>} optional>
            <Input
              value={form.addressComplement}
              onChange={(e) => setField('addressComplement', e.target.value)}
            />
          </Field>
          <FieldRow>
            <Field label={<Label>Cidade</Label>}>
              <Input
                value={form.city}
                onChange={(e) => setField('city', e.target.value)}
              />
            </Field>
            <Field label={<Label>Estado</Label>}>
              <Input
                value={form.state}
                onChange={(e) => setField('state', e.target.value.toUpperCase())}
                maxLength={2}
                className="uppercase"
              />
            </Field>
          </FieldRow>
          <Field label={<Label>Celular</Label>} hint="Mesmo número usado para entrar.">
            <MaskedInput
              mask="phone"
              value={form.mobilePhone}
              onValueChange={(_f, raw) => setField('mobilePhone', raw)}
            />
          </Field>
        </div>

        <SectionTitle>Contatos de emergência</SectionTitle>
        <div className="px-5 pb-32 grid gap-3">
          {form.contacts.map((c, i) => (
            <div
              key={c.id}
              className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) p-4"
            >
              <div className="flex items-baseline justify-between mb-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground)">
                  Contato {i + 1}
                </p>
                {form.contacts.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeContact(c.id)}
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
                    onChange={(e) => updateContact(c.id, { name: e.target.value })}
                  />
                </Field>
                <FieldRow>
                  <Field label={<Label>Parentesco</Label>}>
                    <Input
                      value={c.relationship}
                      onChange={(e) =>
                        updateContact(c.id, { relationship: e.target.value })
                      }
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
            </div>
          ))}
          {form.contacts.length < 3 && (
            <button
              type="button"
              onClick={addContact}
              className="rounded-(--radius-md) border-2 border-dashed border-(color:--color-border-strong) py-4 flex items-center justify-center gap-2 text-sm text-(color:--color-muted-foreground) hover:bg-(color:--color-muted) hover:text-(color:--color-foreground) transition"
            >
              <Plus className="size-4" strokeWidth={1.5} />
              Adicionar contato
            </button>
          )}
        </div>

        {error && (
          <p className="px-5 pb-3 text-sm text-(color:--color-destructive) text-center">
            {error}
          </p>
        )}
        {savedNotice && !error && (
          <p className="px-5 pb-3 text-sm text-(color:--color-primary) text-center">
            Salvo.
          </p>
        )}

        <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-20 px-5 pt-3 pb-2 bg-gradient-to-t from-(color:--color-background) via-(color:--color-background)/90 to-transparent">
          <Button type="submit" block size="lg" disabled={update.isPending}>
            {update.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Salvando…
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </form>
    </Page>
  );
}
