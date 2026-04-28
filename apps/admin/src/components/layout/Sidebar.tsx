import { Link } from '@tanstack/react-router';
import { Logomark } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';

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
      { to: '/lojinha-site', label: 'Lojinha' },
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
    <aside
      className={cn(
        'w-64 shrink-0 h-screen sticky top-0 z-20',
        'flex flex-col',
        'bg-(color:--color-surface) border-r border-(color:--color-border)',
      )}
    >
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-(color:--color-border)">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <span className="text-(color:--color-primary)">
            <Logomark />
          </span>
          <span>
            <p
              className="font-display text-[17px] leading-none tracking-tight"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
            >
              Santa Rita
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(color:--color-muted-foreground) mt-1.5 font-mono">
              Painel administrativo
            </p>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="flex items-center gap-2 px-3 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-(color:--color-subtle)">
                {g.title}
              </span>
              <span
                aria-hidden
                className="flex-1 h-px bg-(color:--color-border)"
              />
            </div>
            <ul className="space-y-0.5">
              {g.items.map((i) => (
                <li key={i.to}>
                  <Link
                    to={i.to}
                    activeOptions={{ exact: i.to === '/' }}
                    className={cn(
                      'group flex items-center gap-2 rounded-(--radius-sm) px-3 py-1.5 text-[13px] leading-snug',
                      'text-(color:--color-muted-foreground) transition-colors duration-100',
                      'hover:text-(color:--color-foreground) hover:bg-(color:--color-surface-2)/60',
                    )}
                    activeProps={{
                      className:
                        '!text-(color:--color-foreground) !bg-(color:--color-surface-2) font-medium relative',
                    }}
                  >
                    <span className="relative flex-1">{i.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-(color:--color-border) text-[10px] font-mono uppercase tracking-[0.18em] text-(color:--color-subtle)">
        v0.1 · Comunidade
      </div>
    </aside>
  );
}
