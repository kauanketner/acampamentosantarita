import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/perfil/saude')({
  component: PerfilSaude,
});

function PerfilSaude() {
  return (
    <div>
      <TopBar title="Saúde" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: form completo do health_profile (mesmas 19 perguntas).
              Mostrar last_reviewed_at e botão "Confirmar dados" (atualiza timestamp). */}
        </p>
      </div>
    </div>
  );
}
