import { createFileRoute } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { announcements } from '@/mock/data';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/avisos/')({
  component: AvisosIndex,
});

const audienceLabel: Record<string, string> = {
  todos: 'comunidade',
  equipistas: 'equipistas',
  evento: 'evento',
  tribo: 'sua tribo',
};

function AvisosIndex() {
  const unreadCount = announcements.filter((a) => !a.read).length;

  return (
    <Page>
      <div className="safe-top" />
      <PageHeader
        eyebrow={unreadCount > 0 ? `${unreadCount} não lidos` : 'Tudo em dia'}
        title={
          <>
            Da
            <br />
            <span className="font-display-italic">comunidade.</span>
          </>
        }
        className="pt-12"
      />

      {announcements.length === 0 ? (
        <EmptyState
          className="py-20"
          icon={<Bell className="size-10" strokeWidth={1.2} />}
          title="Nenhum aviso"
          description="Quando houver novidades, você verá aqui."
        />
      ) : (
        <ul className="px-5 grid gap-3 pb-6">
          {announcements.map((a) => (
            <li
              key={a.id}
              className={cn(
                'rounded-(--radius-lg) border p-5',
                a.read
                  ? 'border-(color:--color-border) bg-(color:--color-surface)'
                  : 'border-(color:--color-primary)/30 bg-(color:--color-primary-soft)/40 surface-warmth',
              )}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
                  {timeAgo(a.publishedAt)}
                </span>
                <Badge tone={a.read ? 'neutral' : 'primary'}>
                  {audienceLabel[a.audience] ?? a.audience}
                </Badge>
              </div>
              <h3
                className={cn(
                  'font-display text-xl tracking-tight leading-snug text-balance',
                  !a.read && 'text-(color:--color-primary)',
                )}
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
              >
                {a.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-(color:--color-muted-foreground) mt-2 text-pretty">
                {a.body}
              </p>
              {a.eventName && (
                <p className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-subtle) mt-3">
                  {a.eventName}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d atrás`;
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
