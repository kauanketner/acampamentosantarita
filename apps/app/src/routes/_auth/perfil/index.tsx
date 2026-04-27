import { Link, createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/perfil/')({
  component: PerfilIndex,
});

const items = [
  { to: '/perfil/editar' as const, label: 'Dados pessoais' },
  { to: '/perfil/saude' as const, label: 'Saúde' },
  { to: '/perfil/fe' as const, label: 'Vida de fé' },
  { to: '/perfil/historico' as const, label: 'Histórico de acampamentos' },
  { to: '/perfil/notificacoes' as const, label: 'Notificações' },
];

function PerfilIndex() {
  return (
    <div>
      <TopBar title="Perfil" />
      <div className="px-4 py-4 space-y-3">
        {/* TODO: header com foto/nome/edição que mais participou. */}
        <ul className="rounded-xl border bg-card divide-y">
          {items.map((i) => (
            <li key={i.to}>
              <Link to={i.to} className="flex items-center justify-between px-4 py-3.5 text-sm">
                <span>{i.label}</span>
                <span className="text-muted-foreground">›</span>
              </Link>
            </li>
          ))}
        </ul>
        {/* TODO: botão sair (POST /v1/auth/logout). */}
      </div>
    </div>
  );
}
