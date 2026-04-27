import { createFileRoute } from '@tanstack/react-router';
import { Loader2, Lock } from 'lucide-react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Badge } from '@/components/ui/badge';
import { useFullProfile } from '@/lib/queries/profile';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/perfil/historico')({
  component: PerfilHistorico,
});

function PerfilHistorico() {
  const { data, isLoading } = useFullProfile();
  const sorted = (data?.participations ?? []).slice().sort((a, b) => b.campEdition - a.campEdition);

  if (isLoading) {
    return (
      <Page>
        <TopBar back="/perfil" title="Histórico" border />
        <div className="flex-1 flex items-center justify-center py-24 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <TopBar back="/perfil" title="Histórico" border />

      <div className="px-5 pt-4 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          {sorted.length}{' '}
          {sorted.length === 1 ? 'participação registrada' : 'participações registradas'}
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Sua história com a comunidade.
        </h1>
      </div>

      {sorted.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <p className="text-[15px] text-(color:--color-muted-foreground) leading-relaxed max-w-sm mx-auto">
            Você ainda não tem participações registradas.
            <br />
            Quando você se inscrever em um acampamento, ele aparece aqui.
          </p>
        </div>
      ) : (
        <div className="px-5 pt-6 pb-12 relative">
          <div
            aria-hidden
            className="absolute left-[35px] top-7 bottom-6 w-px bg-(color:--color-border-strong)"
          />
          <ul className="grid gap-4">
            {sorted.map((p, i) => (
              <li key={p.id} className="relative flex gap-4">
                <div
                  className={cn(
                    'size-10 rounded-full inline-flex items-center justify-center font-mono text-xs font-medium shrink-0 border-2 z-10',
                    p.isLegacy
                      ? 'bg-(color:--color-surface) border-(color:--color-border-strong) text-(color:--color-muted-foreground)'
                      : 'bg-(color:--color-primary) border-(color:--color-primary) text-(color:--color-primary-foreground)',
                  )}
                >
                  {p.campEdition}
                </div>

                <div
                  className={cn(
                    'flex-1 surface-warmth rounded-(--radius-md) border border-(color:--color-border) p-4',
                    i === 0 && 'border-(color:--color-primary)/40',
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                      {p.campYear ? `${p.campYear} · ` : ''}
                      {p.campEdition}º acampamento
                    </p>
                    {!p.isLegacy && (
                      <Badge tone="primary" className="inline-flex items-center gap-1">
                        <Lock className="size-2.5" /> sistema
                      </Badge>
                    )}
                  </div>

                  <p
                    className="font-display text-lg tracking-tight"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                  >
                    {p.role === 'lider'
                      ? 'Líder'
                      : p.role === 'equipista'
                        ? 'Equipista'
                        : 'Campista'}
                    {p.tribeNameLegacy && (
                      <>
                        {' '}
                        <span className="font-display-italic text-(color:--color-muted-foreground) text-base">
                          — {p.tribeNameLegacy}
                        </span>
                      </>
                    )}
                  </p>

                  {p.serviceTeam && (
                    <p className="text-sm text-(color:--color-muted-foreground) mt-1">
                      {p.serviceTeam}
                      {p.functionRole && ` · ${p.functionRole}`}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 px-1 text-xs text-(color:--color-muted-foreground) leading-relaxed">
            <p>
              Participações marcadas como{' '}
              <Badge tone="primary" className="inline-flex items-center gap-1 mx-0.5">
                <Lock className="size-2.5" /> sistema
              </Badge>{' '}
              são criadas a partir das suas inscrições e não podem ser editadas aqui.
            </p>
          </div>
        </div>
      )}
    </Page>
  );
}
