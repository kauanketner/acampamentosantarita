import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/perfil/historico')({
  component: PerfilHistorico,
});

function PerfilHistorico() {
  return (
    <div>
      <TopBar title="Histórico de acampamentos" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: timeline com participações:
              - Geradas pelo sistema (is_legacy=false): apenas leitura.
              - Declaradas (is_legacy=true): editáveis, com botão remover.
              CTA "Adicionar participação anterior" abre form (mesmas regras do passo 6 do cadastro veterano). */}
        </p>
      </div>
    </div>
  );
}
