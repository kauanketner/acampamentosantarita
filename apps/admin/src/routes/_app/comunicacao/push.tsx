import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/comunicacao/push')({
  component: Push,
});

function Push() {
  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <header>
        <h1 className="font-serif text-2xl">Push notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Notificações push pro app (instalado em homescreen).
        </p>
      </header>

      <div className="rounded-lg border bg-card p-5 space-y-3">
        <p className="text-sm">
          O envio de push está como{' '}
          <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium bg-secondary border-border">
            pendente
          </span>
          . Pra ativar é preciso:
        </p>
        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 ml-2">
          <li>Gerar um par de chaves VAPID (com web-push CLI).</li>
          <li>
            Setar <span className="font-mono">VAPID_PUBLIC_KEY</span>,{' '}
            <span className="font-mono">VAPID_PRIVATE_KEY</span> e{' '}
            <span className="font-mono">VAPID_SUBJECT</span> no{' '}
            <span className="font-mono">.env</span> do API.
          </li>
          <li>
            Implementar o disparador (<span className="font-mono">lib/push.ts</span>) usando{' '}
            <span className="font-mono">web-push</span> e chamar nos pontos onde o aviso é publicado
            com <span className="font-mono">sendPush=true</span>.
          </li>
          <li>
            Implementar o controller <span className="font-mono">subscribePush</span> pra registrar
            subscriptions vindas do PWA.
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Por enquanto, os avisos publicados em{' '}
          <Link to="/comunicacao/avisos" className="text-primary underline">
            Avisos
          </Link>{' '}
          aparecem no app campista assim que ele abrir, mesmo sem push (refresh do feed).
        </p>
      </div>

      <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4 text-sm text-amber-900 dark:text-amber-100 space-y-2">
        <p>
          <strong>Workaround atual:</strong> avisos críticos (financeiro, cancelamentos) chegam por
          WhatsApp via WTS. Marcar <span className="font-mono">sendPush</span> hoje só registra a
          flag — a entrega de fato vai funcionar quando a infra acima estiver pronta.
        </p>
      </div>
    </div>
  );
}
