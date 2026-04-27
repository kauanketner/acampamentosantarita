import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/perfil/editar')({
  component: PerfilEditar,
});

function PerfilEditar() {
  return (
    <div>
      <TopBar title="Editar perfil" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: form com campos dos passos 1, 2 e 3 do cadastro (dados pessoais,
              endereço, contatos de emergência) + avatar. */}
        </p>
      </div>
    </div>
  );
}
