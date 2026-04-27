import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/perfil/fe')({
  component: PerfilFe,
});

function PerfilFe() {
  return (
    <div>
      <TopBar title="Vida de fé" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: religião, paróquia, grupo, sacramentos recebidos (multi-select). */}
        </p>
      </div>
    </div>
  );
}
