import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/$id/')({
  component: EventoVisaoGeral,
});

function EventoVisaoGeral() {
  const { id } = Route.useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Evento — {id}</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: visão geral com cards (datas, local, status, capa, KPIs do evento).
            Atalhos para Inscrições, Perguntas, Tribos, Equipes, PDV, Relatórios. */}
      </p>
    </div>
  );
}
