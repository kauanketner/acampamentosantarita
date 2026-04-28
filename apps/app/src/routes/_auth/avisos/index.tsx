import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  type Announcement,
  type AnnouncementAudience,
  useAnnouncements,
} from '@/lib/queries/communication';
import { createFileRoute } from '@tanstack/react-router';
import { Bell, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/_auth/avisos/')({
  component: AvisosIndex,
});

const audienceLabel: Record<AnnouncementAudience, string> = {
  todos: 'comunidade',
  participantes_evento: 'evento',
  equipistas: 'equipistas',
  tribo_x: 'sua tribo',
  equipe_x: 'sua equipe',
};

function AvisosIndex() {
  const { data, isLoading, isError } = useAnnouncements();

  return (
    <Page>
      <div className="safe-top" />
      <PageHeader
        eyebrow={
          isLoading ? 'Carregando…' : data && data.length > 0 ? 'Da comunidade' : 'Tudo em silêncio'
        }
        title={
          <>
            Da
            <br />
            <span className="font-display-italic">comunidade.</span>
          </>
        }
        className="pt-12"
      />

      {isLoading && (
        <div className="flex justify-center py-16 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {isError && (
        <EmptyState
          className="py-16"
          icon={<Bell className="size-10" strokeWidth={1.2} />}
          title="Não conseguimos buscar"
          description="Tente daqui a pouco."
        />
      )}

      {data && data.length === 0 && (
        <EmptyState
          className="py-20"
          icon={<Bell className="size-10" strokeWidth={1.2} />}
          title="Nenhum aviso"
          description="Quando a coordenação publicar algo, você verá aqui."
        />
      )}

      {data && data.length > 0 && (
        <ul className="px-5 grid gap-3 pb-6">
          {data.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </ul>
      )}
    </Page>
  );
}

function AnnouncementCard({ announcement: a }: { announcement: Announcement }) {
  return (
    <li className="rounded-(--radius-lg) border border-(color:--color-border) bg-(color:--color-surface) p-5">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground)">
          {a.publishedAt ? timeAgo(a.publishedAt) : 'recente'}
        </span>
        <Badge tone="primary">{audienceLabel[a.targetAudience] ?? 'comunidade'}</Badge>
      </div>
      <h3
        className="font-display text-xl tracking-tight leading-snug text-balance"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
      >
        {a.title}
      </h3>
      <p className="text-[15px] leading-relaxed text-(color:--color-muted-foreground) mt-2 text-pretty whitespace-pre-line">
        {a.body}
      </p>
      {a.event && (
        <p className="font-mono text-[10px] uppercase tracking-wider text-(color:--color-subtle) mt-3">
          {a.event.name}
        </p>
      )}
    </li>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d atrás`;
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}
