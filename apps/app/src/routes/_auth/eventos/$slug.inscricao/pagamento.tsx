import { Page } from '@/components/shell/Page';
import { TopBar } from '@/components/shell/TopBar';
import { Button } from '@/components/ui/button';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/eventos/$slug/inscricao/pagamento')({
  component: InscricaoPagamento,
});

// Tela mantida como placeholder informativo. O fluxo de pagamento online
// (Asaas / pix) será habilitado quando a coordenação ligar a integração.
// Hoje a inscrição é confirmada pendente e a coordenação envia o pagamento
// fora do app.
function InscricaoPagamento() {
  return (
    <Page withBottomNav={false}>
      <TopBar back="/minhas-inscricoes" title="Pagamento" border />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(color:--color-muted-foreground) mb-3">
          Em construção
        </p>
        <h1
          className="font-display text-[clamp(1.85rem,8vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-balance"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          O pagamento online vem em breve.
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-(color:--color-muted-foreground)">
          Por enquanto, sua inscrição fica registrada e a coordenação envia as instruções de
          pagamento por fora do app.
        </p>
        <div className="mt-8 grid gap-2.5 w-full max-w-xs">
          <Button asChild block size="lg">
            <Link to="/minhas-inscricoes">Minhas inscrições</Link>
          </Button>
          <Button asChild block size="lg" variant="ghost">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </Page>
  );
}
