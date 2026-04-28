import { Field } from '@/components/form/Field';
import { Page } from '@/components/shell/Page';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { TopBar } from '@/components/shell/TopBar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/cn';
import { useFaith, useUpdateFaith } from '@/lib/queries/faith';
import type { Sacrament } from '@/lib/queries/profile';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_auth/perfil/fe')({
  component: PerfilFe,
});

const SACRAMENTS: { id: Sacrament; label: string }[] = [
  { id: 'batismo', label: 'Batismo' },
  { id: 'eucaristia', label: 'Eucaristia' },
  { id: 'crisma', label: 'Crisma' },
  { id: 'matrimonio', label: 'Matrimônio' },
  { id: 'ordem', label: 'Ordem' },
  { id: 'uncao_enfermos', label: 'Unção dos enfermos' },
  { id: 'confissao', label: 'Confissão' },
];

type Form = {
  religion: string;
  parish: string;
  groupName: string;
  sacraments: Sacrament[];
};

function PerfilFe() {
  const { data, isLoading } = useFaith();
  const update = useUpdateFaith();

  const [form, setForm] = useState<Form>({
    religion: '',
    parish: '',
    groupName: '',
    sacraments: [],
  });
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoading || hydrated) return;
    setForm({
      religion: data?.profile?.religion ?? '',
      parish: data?.profile?.parish ?? '',
      groupName: data?.profile?.groupName ?? '',
      sacraments: data?.sacraments ?? [],
    });
    setHydrated(true);
  }, [data, isLoading, hydrated]);

  const toggle = (id: Sacrament, checked: boolean) =>
    setForm((s) => ({
      ...s,
      sacraments: checked ? [...s.sacraments, id] : s.sacraments.filter((x) => x !== id),
    }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      await update.mutateAsync({
        religion: form.religion.trim() || null,
        parish: form.parish.trim() || null,
        groupName: form.groupName.trim() || null,
        sacraments: form.sacraments,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
    }
  };

  if (isLoading && !hydrated) {
    return (
      <Page>
        <TopBar back="/perfil" title="Vida de fé" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <TopBar back="/perfil" title="Vida de fé" border />

      <form onSubmit={onSubmit}>
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
          <Field label={<Label>Religião</Label>} optional>
            <Input
              value={form.religion}
              onChange={(e) => setForm((s) => ({ ...s, religion: e.target.value }))}
              placeholder="Católica romana"
            />
          </Field>
          <Field label={<Label>Paróquia</Label>} optional>
            <Input
              value={form.parish}
              onChange={(e) => setForm((s) => ({ ...s, parish: e.target.value }))}
            />
          </Field>
          <Field label={<Label>Grupo / pastoral</Label>} optional>
            <Input
              value={form.groupName}
              onChange={(e) => setForm((s) => ({ ...s, groupName: e.target.value }))}
              placeholder="Pastoral da juventude"
            />
          </Field>
        </div>

        <SectionTitle>Sacramentos recebidos</SectionTitle>
        <div className="px-5 pb-32 grid gap-1.5">
          {SACRAMENTS.map((s) => {
            const checked = form.sacraments.includes(s.id);
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
                <Checkbox checked={checked} onCheckedChange={(v) => toggle(s.id, !!v)} />
                <span className="text-[15px] font-medium">{s.label}</span>
              </label>
            );
          })}
        </div>

        {error && (
          <p className="px-5 pb-3 text-sm text-(color:--color-destructive) text-center">{error}</p>
        )}
        {saved && !error && (
          <p className="px-5 pb-3 text-sm text-(color:--color-primary) text-center">Salvo.</p>
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
