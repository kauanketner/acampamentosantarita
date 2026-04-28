import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/configuracoes/integracoes')({
  component: ConfiguracoesIntegracoes,
});

type IntegrationStatus = 'live' | 'configured' | 'pending';

const integrations: Array<{
  name: string;
  status: IntegrationStatus;
  description: string;
  details: string;
}> = [
  {
    name: 'WTS Chat (WhatsApp OTP)',
    status: 'live',
    description: 'Envio do código de 6 dígitos pelo WhatsApp.',
    details:
      'Endpoint /v1/send/otp do WTS, template autenticação. Número de envio (11) 5107-3435.',
  },
  {
    name: 'Postgres + Drizzle',
    status: 'live',
    description: 'Banco de dados principal do app.',
    details: 'Postgres 16 em Docker no VPS, schema gerenciado por Drizzle.',
  },
  {
    name: 'Caddy + Let\'s Encrypt',
    status: 'live',
    description: 'Reverse proxy, HTTPS automático.',
    details:
      'Subdomínios api/app2/admin emitem certificado a cada 60 dias automaticamente.',
  },
  {
    name: 'Asaas (cobranças PIX/cartão)',
    status: 'pending',
    description: 'Integração de pagamento online.',
    details:
      'Endpoint /v1/finance/invoices/:id/asaas-charge ainda como stub. Webhook em /webhooks/asaas. Configure ASAAS_API_KEY/ASAAS_WEBHOOK_TOKEN no .env quando estiver pronto.',
  },
  {
    name: 'Web Push (notificações)',
    status: 'pending',
    description: 'Notificações push pra app (PWA).',
    details:
      'Endpoint /v1/communication/push/subscribe stub. Configure VAPID_PUBLIC_KEY/PRIVATE_KEY pra ligar.',
  },
  {
    name: 'Resend (e-mails transacionais)',
    status: 'pending',
    description: 'E-mails de confirmação, recibos, redefinição.',
    details:
      'Configure RESEND_API_KEY no .env. EMAIL_FROM padrão: contato@acampamentosantarita.com.br.',
  },
  {
    name: 'Cloudflare R2 (storage de imagens)',
    status: 'pending',
    description: 'Storage S3-compatível pra fotos.',
    details:
      'Hoje uploads ficam no disco do VPS (/uploads/). Configure R2_* no .env pra mover para R2.',
  },
];

const toneClass: Record<IntegrationStatus, string> = {
  live:
    'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
  configured:
    'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  pending: 'bg-secondary text-secondary-foreground border-border',
};

const statusLabel: Record<IntegrationStatus, string> = {
  live: 'ativo',
  configured: 'configurado',
  pending: 'pendente',
};

function ConfiguracoesIntegracoes() {
  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <header>
        <h1 className="font-serif text-2xl">Integrações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Estado dos serviços externos conectados ao sistema.
        </p>
      </header>

      <ul className="space-y-3">
        {integrations.map((i) => (
          <li
            key={i.name}
            className="rounded-lg border bg-card p-4 flex items-start gap-3"
          >
            <span
              className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium ${toneClass[i.status]}`}
            >
              {statusLabel[i.status]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">{i.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {i.description}
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-1.5 leading-relaxed">
                {i.details}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">
        Mudanças de configuração rodam no <span className="font-mono">.env</span>{' '}
        do API. Use <span className="font-mono">/srv/apps/santarita/scripts/redeploy.sh</span>{' '}
        depois de mexer.
      </p>
    </div>
  );
}
