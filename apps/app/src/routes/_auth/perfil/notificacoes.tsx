import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/perfil/notificacoes')({
  component: PerfilNotificacoes,
});

function PerfilNotificacoes() {
  return (
    <div>
      <TopBar title="Notificações" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: toggle "Receber push" (chama lib/push.ts.askPermission + subscribe).
              Toggles por categoria (avisos da comunidade, lembretes financeiros,
              novidades do site). */}
        </p>
      </div>
    </div>
  );
}
