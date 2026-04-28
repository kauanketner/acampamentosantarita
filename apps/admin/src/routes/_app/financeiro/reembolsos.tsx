import { brl } from '@/lib/format';
import { useAdminRefunds } from '@/lib/queries/reports';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/financeiro/reembolsos')({
  component: Reembolsos,
});

function Reembolsos() {
  const { data, isLoading } = useAdminRefunds();

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Reembolsos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Estornos de pagamentos. Fluxo Asaas será habilitado quando a integração estiver pronta —
          por enquanto, os estornos são manuais.
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-10 text-center">
          <p className="font-serif text-xl">Sem reembolsos</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Quando você processar um estorno, ele aparece aqui.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-2 font-medium">Pessoa</th>
                <th className="px-4 py-2 font-medium">Fatura</th>
                <th className="px-4 py-2 font-medium">Motivo</th>
                <th className="px-4 py-2 font-medium">Quando</th>
                <th className="px-4 py-2 font-medium text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                  <td className="px-4 py-2 font-medium">{r.person.fullName}</td>
                  <td className="px-4 py-2 text-muted-foreground text-xs">
                    {r.invoice.description ?? '—'}
                  </td>
                  <td className="px-4 py-2 text-xs">{r.reason ?? '—'}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {new Date(r.refundedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{brl(Number(r.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
