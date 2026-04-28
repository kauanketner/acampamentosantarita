import { useAuditLog } from '@/lib/queries/reports';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/configuracoes/auditoria')({
  component: ConfiguracoesAuditoria,
});

function ConfiguracoesAuditoria() {
  const { data, isLoading } = useAuditLog();

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Auditoria</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Histórico de ações administrativas. Útil pra rastrear mudanças relevantes em cobranças,
          aprovações e configurações.
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Sem registros</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            O audit log começa a registrar quando houver ações administrativas sensíveis.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-2 font-medium">Quando</th>
                <th className="px-4 py-2 font-medium">Usuário</th>
                <th className="px-4 py-2 font-medium">Ação</th>
                <th className="px-4 py-2 font-medium">Entidade</th>
                <th className="px-4 py-2 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                  <td className="px-4 py-2 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-2">
                    <p className="text-sm">{row.userEmail ?? row.userPhone ?? '—'}</p>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{row.action}</td>
                  <td className="px-4 py-2 text-xs">
                    <p>{row.entityType}</p>
                    {row.entityId && (
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {row.entityId.slice(0, 8)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2 text-[11px] text-muted-foreground font-mono">
                    {row.ip ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
