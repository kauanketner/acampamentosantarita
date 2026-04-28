import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/configuracoes/permissoes')({
  component: ConfiguracoesPermissoes,
});

const matrix = [
  { area: 'Eventos', admin: '✓', equipe: '✓', tesouraria: '○ ler', comunicacao: '○ ler' },
  {
    area: 'Inscrições',
    admin: '✓',
    equipe: '✓',
    tesouraria: '○ ler',
    comunicacao: '○ ler',
  },
  { area: 'Tribos', admin: '✓', equipe: '✓', tesouraria: '○ ler', comunicacao: '○ ler' },
  { area: 'Equipes', admin: '✓', equipe: '✓', tesouraria: '○ ler', comunicacao: '○ ler' },
  { area: 'Pessoas', admin: '✓', equipe: '✓', tesouraria: '✓', comunicacao: '○ ler' },
  { area: 'PDV', admin: '✓', equipe: '✓', tesouraria: '✓', comunicacao: '—' },
  { area: 'Faturas/Pagamentos', admin: '✓', equipe: '○ ler', tesouraria: '✓', comunicacao: '—' },
  { area: 'Avisos', admin: '✓', equipe: '○ ler', tesouraria: '—', comunicacao: '✓' },
  { area: 'FAQ / Galeria / Posts', admin: '✓', equipe: '—', tesouraria: '—', comunicacao: '✓' },
  { area: 'Lojinha', admin: '✓', equipe: '—', tesouraria: '—', comunicacao: '✓' },
  { area: 'Relatórios', admin: '✓', equipe: '○ ler', tesouraria: '✓', comunicacao: '○ ler' },
  { area: 'Auditoria', admin: '✓', equipe: '—', tesouraria: '○ ler', comunicacao: '—' },
  { area: 'Usuários e Permissões', admin: '✓', equipe: '—', tesouraria: '—', comunicacao: '—' },
];

function ConfiguracoesPermissoes() {
  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Permissões</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Permissões hoje são derivadas da função (role) do usuário. Esta matriz
          serve de referência prática.
        </p>
      </header>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
              <th className="px-4 py-2 font-medium">Área</th>
              <th className="px-4 py-2 font-medium text-center">Admin</th>
              <th className="px-4 py-2 font-medium text-center">Equipe</th>
              <th className="px-4 py-2 font-medium text-center">Tesouraria</th>
              <th className="px-4 py-2 font-medium text-center">Comunicação</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.area} className="border-b last:border-b-0">
                <td className="px-4 py-2 font-medium">{row.area}</td>
                <td className="px-4 py-2 text-center">{row.admin}</td>
                <td className="px-4 py-2 text-center text-muted-foreground">
                  {row.equipe}
                </td>
                <td className="px-4 py-2 text-center text-muted-foreground">
                  {row.tesouraria}
                </td>
                <td className="px-4 py-2 text-center text-muted-foreground">
                  {row.comunicacao}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-md border bg-card p-4 text-xs text-muted-foreground space-y-1">
        <p>✓ acesso total · ○ ler somente · — sem acesso</p>
        <p>
          Observação: hoje o backend trata <em>qualquer role !== participante</em>{' '}
          como autorizado pra todas as áreas administrativas. As restrições por
          função granular ficam pra uma próxima iteração — por enquanto,
          atribua a função certa pra cada pessoa em{' '}
          <span className="font-medium text-foreground">Configurações → Usuários</span>.
        </p>
      </div>
    </div>
  );
}
