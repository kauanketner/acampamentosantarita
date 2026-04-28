import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/pessoas/nova')({
  component: NovaPessoa,
});

// Cadastros novos vêm do app campista (fluxo OTP). Admin não tem caminho
// "criar do zero" via formulário hoje — porque OTP precisa do telefone do
// usuário pra confirmar. Endpoint de criação direta admin-only será
// adicionado quando precisarmos importar histórico legado em massa.
function NovaPessoa() {
  return (
    <div className="p-6 max-w-2xl space-y-4">
      <Link to="/pessoas" className="text-xs text-muted-foreground hover:text-foreground">
        ← Pessoas
      </Link>
      <h1 className="font-serif text-2xl">Nova pessoa</h1>
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <p className="text-sm">
          Cadastros são criados quando o próprio interessado faz login pelo app em{' '}
          <span className="font-mono">app2.acampamentosantarita.com.br</span> — primeiro acesso pelo
          telefone, OTP via WhatsApp, fluxo guiado de 5 passos.
        </p>
        <p className="text-sm text-muted-foreground">
          Pra dar acesso administrativo a alguém que já se cadastrou: vá em{' '}
          <Link to="/pessoas" className="text-primary underline">
            Pessoas
          </Link>{' '}
          → abra o perfil → clique em &quot;Promover a admin/equipe&quot; (em breve).
        </p>
        <p className="text-xs text-muted-foreground">
          Importação em massa de histórico legado será habilitada quando for necessário.
        </p>
      </div>
    </div>
  );
}
