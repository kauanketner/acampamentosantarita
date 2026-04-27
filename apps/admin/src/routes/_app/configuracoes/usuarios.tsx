import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/configuracoes/usuarios')({
  component: ConfiguracoesUsuarios,
});

function ConfiguracoesUsuarios() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Usuários</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: CRUD de users (admin, equipe_acampamento, tesouraria, comunicacao,
            participante). Reset de senha, ativar/desativar. */}
      </p>
    </div>
  );
}
