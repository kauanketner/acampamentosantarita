import { Link, createFileRoute } from '@tanstack/react-router';
import { CreditCard, FileText, QrCode } from 'lucide-react';
import { useState } from 'react';
import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { brl } from '@/mock/data';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_auth/eventos/$slug/inscricao/pagamento')({
  component: InscricaoPagamento,
});

type Method = 'pix' | 'cartao' | 'boleto';

function InscricaoPagamento() {
  const { slug } = Route.useParams();
  const [method, setMethod] = useState<Method>('pix');
  const value = 280;

  return (
    <Page withBottomNav={false}>
      <TopBar back={`/eventos/${slug}/inscricao`} title="Pagamento" border />

      <div className="px-5 pt-4 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mb-2">
          14º acampamento · equipista
        </p>
        <h1
          className="font-display text-[clamp(2rem,9vw,2.6rem)] leading-[1] tracking-[-0.025em]"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {brl(value)}
        </h1>
      </div>

      <div className="px-5 grid gap-2.5 pb-2">
        <PaymentOption
          method="pix"
          current={method}
          onSelect={setMethod}
          title="PIX"
          description="Aprovação imediata"
          icon={<QrCode className="size-5" strokeWidth={1.5} />}
        />
        <PaymentOption
          method="cartao"
          current={method}
          onSelect={setMethod}
          title="Cartão de crédito"
          description="Em até 6x sem juros"
          icon={<CreditCard className="size-5" strokeWidth={1.5} />}
        />
        <PaymentOption
          method="boleto"
          current={method}
          onSelect={setMethod}
          title="Boleto"
          description="Compensa em até 3 dias úteis"
          icon={<FileText className="size-5" strokeWidth={1.5} />}
        />
      </div>

      <div className="px-5 py-6">
        <Separator variant="ornament" />
      </div>

      {/* Method-specific info */}
      <div className="px-5 pb-32">
        {method === 'pix' && (
          <div className="rounded-(--radius-lg) border border-(color:--color-border-strong) bg-(color:--color-surface) p-6 text-center">
            <div
              aria-hidden
              className="mx-auto size-44 rounded-(--radius-md) bg-(color:--color-foreground) flex items-center justify-center mb-4"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 30%, transparent 6px, oklch(0.95 0.018 78) 6.5px), repeating-linear-gradient(45deg, oklch(0.21 0.025 50), oklch(0.21 0.025 50) 4px, transparent 4px, transparent 8px)',
              }}
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-muted-foreground) mb-1">
              Aponte a câmera
            </p>
            <p className="text-[13px] text-(color:--color-muted-foreground)">
              Ou copie o código:
            </p>
            <p className="font-mono text-[11px] mt-3 px-3 py-2 rounded-md bg-(color:--color-muted) inline-block break-all">
              00020126360014BR.GOV.BCB.PIX0114+5531999990000
            </p>
          </div>
        )}
        {method === 'cartao' && (
          <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
            Você será redirecionada para a tela segura do Asaas para preencher os dados
            do cartão e confirmar o pagamento.
          </p>
        )}
        {method === 'boleto' && (
          <p className="text-sm text-(color:--color-muted-foreground) leading-relaxed">
            Geramos o boleto no seu nome com vencimento de 3 dias. O link chega no
            seu e-mail e fica disponível em "Faturas".
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-(color:--color-background)/85 backdrop-blur-md border-t border-(color:--color-border)">
        <Button asChild block size="lg">
          <Link to="/eventos/$slug/inscricao/confirmado" params={{ slug }}>
            {method === 'pix'
              ? 'Já paguei'
              : method === 'cartao'
                ? 'Pagar com cartão'
                : 'Gerar boleto'}
          </Link>
        </Button>
      </div>
    </Page>
  );
}

function PaymentOption({
  method,
  current,
  onSelect,
  title,
  description,
  icon,
}: {
  method: Method;
  current: Method;
  onSelect: (m: Method) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  const checked = method === current;
  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      className={cn(
        'flex items-center gap-3 p-4 rounded-(--radius-md) border text-left transition',
        checked
          ? 'border-(color:--color-primary) bg-(color:--color-primary-soft)'
          : 'border-(color:--color-border) bg-(color:--color-surface) hover:bg-(color:--color-muted)',
      )}
    >
      <div
        className={cn(
          'size-10 rounded-full inline-flex items-center justify-center shrink-0',
          checked
            ? 'bg-(color:--color-primary) text-(color:--color-primary-foreground)'
            : 'bg-(color:--color-muted) text-(color:--color-muted-foreground)',
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[15px]">{title}</p>
        <p className="text-xs text-(color:--color-muted-foreground) mt-0.5">{description}</p>
      </div>
      <span
        className={cn(
          'size-5 rounded-full border-2 shrink-0',
          checked
            ? 'border-(color:--color-primary) bg-(color:--color-primary)'
            : 'border-(color:--color-border-strong)',
        )}
      />
    </button>
  );
}
