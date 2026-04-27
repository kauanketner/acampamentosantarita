import { createFileRoute } from '@tanstack/react-router';
import { Lock, Plus, Trash2 } from 'lucide-react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Badge } from '@/components/ui/badge';
import { myParticipations } from '@/mock/data';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/perfil/historico')({
  component: PerfilHistorico,
});

function PerfilHistorico() {
  // sort desc by edition
  const sorted = [...myParticipations].sort((a, b) => b.edition - a.edition);

  return (
    <Page>
      <TopBar back="/perfil" title="Histórico" border />

      <div className="px-5 pt-4 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          {sorted.length} participações registradas
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Sua história com a comunidade.
        </h1>
      </div>

      {/* Timeline */}
      <div className="px-5 pt-6 pb-6 relative">
        {/* vertical line */}
        <div
          aria-hidden
          className="absolute left-[35px] top-7 bottom-6 w-px bg-(color:--color-border-strong)"
        />

        <ul className="grid gap-4">
          {sorted.map((p, i) => (
            <li key={p.id} className="relative flex gap-4">
              {/* node */}
              <div
                className={cn(
                  'size-10 rounded-full inline-flex items-center justify-center font-mono text-xs font-medium shrink-0 border-2 z-10',
                  p.isLegacy
                    ? 'bg-(color:--color-surface) border-(color:--color-border-strong) text-(color:--color-muted-foreground)'
                    : 'bg-(color:--color-primary) border-(color:--color-primary) text-(color:--color-primary-foreground)',
                )}
              >
                {p.edition}
              </div>

              <div
                className={cn(
                  'flex-1 surface-warmth rounded-(--radius-md) border border-(color:--color-border) p-4',
                  i === 0 && 'border-(color:--color-primary)/40',
                )}
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                    {p.year} · {p.edition}º acampamento
                  </p>
                  {!p.isLegacy ? (
                    <Badge tone="primary" className="inline-flex items-center gap-1">
                      <Lock className="size-2.5" /> sistema
                    </Badge>
                  ) : (
                    <button
                      type="button"
                      className="size-7 inline-flex items-center justify-center rounded-full text-(color:--color-muted-foreground) hover:bg-(color:--color-muted) hover:text-(color:--color-destructive) transition"
                      aria-label="Remover"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                <p
                  className="font-display text-lg tracking-tight capitalize"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                >
                  {p.role === 'lider' ? 'Líder' : p.role === 'equipista' ? 'Equipista' : 'Campista'}
                  {p.tribeName && (
                    <>
                      {' '}
                      <span className="font-display-italic text-(color:--color-muted-foreground) text-base">
                        — {p.tribeName}
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

        {/* add button */}
        <button
          type="button"
          className="mt-4 ml-14 rounded-(--radius-md) border-2 border-dashed border-(color:--color-border-strong) py-4 px-4 flex items-center justify-center gap-2 text-sm text-(color:--color-muted-foreground) hover:bg-(color:--color-muted) hover:text-(color:--color-foreground) transition w-[calc(100%-3.5rem)]"
        >
          <Plus className="size-4" strokeWidth={1.5} />
          Adicionar participação esquecida
        </button>
      </div>

      <div className="px-5 pb-6 text-xs text-(color:--color-muted-foreground) leading-relaxed">
        <p>
          Participações marcadas como{' '}
          <Badge tone="primary" className="inline-flex items-center gap-1 mx-0.5">
            <Lock className="size-2.5" /> sistema
          </Badge>{' '}
          foram criadas a partir das suas inscrições e não podem ser editadas.
        </p>
      </div>
    </Page>
  );
}
