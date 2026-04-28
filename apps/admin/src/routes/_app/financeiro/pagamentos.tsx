import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { brl } from '@/lib/format';
import { useAdminPayments } from '@/lib/queries/reports';

export const Route = createFileRoute('/_app/financeiro/pagamentos')({
  component: Pagamentos,
});

const methodLabel: Record<string, string> = {
  pix: 'PIX',
  cartao: 'Cartão',
  boleto: 'Boleto',
  dinheiro: 'Dinheiro',
  transferencia: 'Transferência',
};

function Pagamentos() {
  const { data, isLoading } = useAdminPayments();
  const [method, setMethod] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = (data ?? []).filter((p) => {
    if (method !== 'all' && p.method !== method) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (!p.person.fullName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const total = filtered.reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Pagamentos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Lista de pagamentos registrados (PIX, dinheiro, cartão, etc).
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome…"
          className="flex-1 min-w-[200px] rounded-md border bg-background px-3 py-1.5 text-sm"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="all">Todos métodos</option>
          {Object.entries(methodLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} pagamento{filtered.length === 1 ? '' : 's'} ·{' '}
          <span className="font-mono">{brl(total)}</span>
        </p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="px-4 py-2 font-medium">Pessoa</th>
                <th className="px-4 py-2 font-medium">Fatura</th>
                <th className="px-4 py-2 font-medium">Método</th>
                <th className="px-4 py-2 font-medium">Quando</th>
                <th className="px-4 py-2 font-medium text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-b-0 hover:bg-secondary/30"
                >
                  <td className="px-4 py-2 font-medium">{p.person.fullName}</td>
                  <td className="px-4 py-2 text-muted-foreground text-xs">
                    {p.invoice.description ?? p.invoice.type}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {methodLabel[p.method] ?? p.method}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {new Date(p.paidAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {brl(Number(p.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && filtered.length === 0 && (
        <div className="rounded-md border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhum pagamento.
        </div>
      )}
    </div>
  );
}
