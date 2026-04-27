import { Link } from '@tanstack/react-router';

type NavItem = { to: string; label: string };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: 'Operação',
    items: [
      { to: '/', label: 'Dashboard' },
      { to: '/pessoas', label: 'Pessoas' },
      { to: '/eventos', label: 'Eventos' },
      { to: '/inscricoes', label: 'Inscrições' },
    ],
  },
  {
    title: 'Estrutura',
    items: [
      { to: '/tribos', label: 'Tribos' },
      { to: '/equipes-servico', label: 'Equipes de Serviço' },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { to: '/financeiro/faturas', label: 'Faturas' },
      { to: '/financeiro/pagamentos', label: 'Pagamentos' },
      { to: '/financeiro/reembolsos', label: 'Reembolsos' },
      { to: '/financeiro/fluxo-caixa', label: 'Fluxo de Caixa' },
    ],
  },
  {
    title: 'Comércio',
    items: [
      { to: '/pdv/itens', label: 'PDV — Itens' },
      { to: '/pdv/contas', label: 'PDV — Contas' },
      { to: '/lojinha-site', label: 'Lojinha do Site' },
    ],
  },
  {
    title: 'Comunicação',
    items: [
      { to: '/comunicacao/avisos', label: 'Avisos' },
      { to: '/comunicacao/push', label: 'Push' },
    ],
  },
  {
    title: 'Conteúdo',
    items: [
      { to: '/site/home', label: 'Home' },
      { to: '/site/paginas', label: 'Páginas' },
      { to: '/site/posts', label: 'Posts' },
      { to: '/site/galeria', label: 'Galeria' },
      { to: '/site/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Análise',
    items: [
      { to: '/relatorios/inscricoes', label: 'Inscrições' },
      { to: '/relatorios/financeiro', label: 'Financeiro' },
      { to: '/relatorios/participantes', label: 'Participantes' },
      { to: '/relatorios/historico-legado', label: 'Histórico Legado' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { to: '/configuracoes/usuarios', label: 'Usuários' },
      { to: '/configuracoes/permissoes', label: 'Permissões' },
      { to: '/configuracoes/integracoes', label: 'Integrações' },
      { to: '/configuracoes/auditoria', label: 'Auditoria' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b">
        <p className="font-serif text-lg">Santa Rita</p>
        <p className="text-xs text-muted-foreground">Painel administrativo</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              {g.title}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((i) => (
                <li key={i.to}>
                  <Link
                    to={i.to}
                    className="block rounded-md px-3 py-1.5 text-sm hover:bg-secondary transition"
                    activeProps={{ className: 'bg-secondary font-medium' }}
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
