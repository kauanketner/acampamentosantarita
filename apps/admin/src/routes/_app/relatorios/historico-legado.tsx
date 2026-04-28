import { useLegacyHistory } from '@/lib/queries/reports';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/relatorios/historico-legado')({
  component: RelatoriosHistoricoLegado,
});

function RelatoriosHistoricoLegado() {
  const { data, isLoading } = useLegacyHistory();
  const max = Math.max(...(data ?? []).map((r) => r.total), 1);

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <header>
        <h1 className="font-serif text-2xl">Relatório — Histórico Legado</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Participações declaradas pelos veteranos no cadastro (1ª a 13ª edições).
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum veterano declarou histórico ainda.</p>
      )}

      {data && data.length > 0 && (
        <section className="rounded-lg border bg-card p-5 space-y-4">
          <ul className="space-y-2">
            {data.map((row) => (
              <li key={row.campEdition} className="space-y-1.5">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">
                    {row.campEdition}º acampamento
                    {row.campYear && (
                      <span className="text-muted-foreground"> · {row.campYear}</span>
                    )}
                  </span>
                  <span className="font-mono">{row.total}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden flex">
                  <span
                    className="bg-sky-500 h-full"
                    style={{ width: `${(row.campistas / max) * 100}%` }}
                    title={`${row.campistas} campistas`}
                  />
                  <span
                    className="bg-amber-500 h-full"
                    style={{ width: `${(row.equipistas / max) * 100}%` }}
                    title={`${row.equipistas} equipistas`}
                  />
                  <span
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(row.lideres / max) * 100}%` }}
                    title={`${row.lideres} líderes`}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground space-x-3">
                  <span>
                    <span className="inline-block size-2 bg-sky-500 rounded-full mr-1" />
                    {row.campistas} campistas
                  </span>
                  <span>
                    <span className="inline-block size-2 bg-amber-500 rounded-full mr-1" />
                    {row.equipistas} equipistas
                  </span>
                  <span>
                    <span className="inline-block size-2 bg-emerald-500 rounded-full mr-1" />
                    {row.lideres} líderes
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
