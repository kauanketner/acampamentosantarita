import { createFileRoute } from '@tanstack/react-router';
import { Bell, BellRing } from 'lucide-react';
import { useState } from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { SectionTitle } from '@/components/shell/SectionTitle';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/perfil/notificacoes')({
  component: PerfilNotificacoes,
});

function PerfilNotificacoes() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [community, setCommunity] = useState(true);
  const [finance, setFinance] = useState(true);
  const [news, setNews] = useState(false);

  return (
    <Page>
      <TopBar back="/perfil" title="Notificações" border />

      <div className="px-5 pt-4 pb-2">
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          Como prefere ouvir.
        </h1>
        <p className="mt-2 text-[15px] text-(color:--color-muted-foreground) leading-relaxed">
          Você pode silenciar quando quiser. Avisos importantes (financeiro, cancelamentos)
          chegam mesmo sem push.
        </p>
      </div>

      {/* Push setup */}
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => setPushEnabled((v) => !v)}
          className={cn(
            'w-full flex items-start gap-4 p-5 rounded-(--radius-lg) border transition text-left',
            pushEnabled
              ? 'border-(color:--color-primary) bg-(color:--color-primary-soft)'
              : 'border-(color:--color-border-strong) bg-(color:--color-surface)',
          )}
        >
          <div
            className={cn(
              'size-12 rounded-full inline-flex items-center justify-center shrink-0 transition',
              pushEnabled
                ? 'bg-(color:--color-primary) text-(color:--color-primary-foreground)'
                : 'bg-(color:--color-muted) text-(color:--color-muted-foreground)',
            )}
          >
            {pushEnabled ? (
              <BellRing className="size-6" strokeWidth={1.5} />
            ) : (
              <Bell className="size-6" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-[16px]">Notificações push</p>
            <p className="text-[13px] text-(color:--color-muted-foreground) mt-0.5 leading-relaxed">
              {pushEnabled
                ? 'Você receberá os avisos da comunidade no seu aparelho.'
                : 'Toque para autorizar e receber avisos no aparelho.'}
            </p>
          </div>
        </button>
      </div>

      <SectionTitle>O que receber</SectionTitle>
      <div className="px-5">
        <div className="rounded-(--radius-md) border border-(color:--color-border) bg-(color:--color-surface) divide-y divide-(color:--color-border)">
          <Row
            title="Avisos da comunidade"
            description="Reuniões, mensagens da coordenação, datas importantes."
            value={community}
            onChange={setCommunity}
          />
          <Row
            title="Lembretes financeiros"
            description="Faturas vencendo, confirmações de pagamento, reembolsos."
            value={finance}
            onChange={setFinance}
          />
          <Row
            title="Novidades do site"
            description="Posts no blog, novas galerias, peças na lojinha."
            value={news}
            onChange={setNews}
          />
        </div>
      </div>

      <SectionTitle>E-mail</SectionTitle>
      <div className="px-5 pb-12">
        <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
          Mensagens transacionais (confirmações, recibos, redefinição de senha) sempre são
          enviadas para o e-mail cadastrado.
        </p>
        <Button variant="link" size="sm" className="-ml-2 mt-2">
          Trocar e-mail
        </Button>
      </div>
    </Page>
  );
}

function Row({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 px-4 py-4 cursor-pointer">
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium leading-tight">{title}</p>
        <p className="text-xs text-(color:--color-muted-foreground) mt-0.5 leading-snug">
          {description}
        </p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </label>
  );
}
