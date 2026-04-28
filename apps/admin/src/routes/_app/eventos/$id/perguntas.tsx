import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/$id/perguntas')({
  component: EventoPerguntas,
});

// As perguntas customizadas já são gerenciadas inline em /eventos/$id
// (CustomQuestionsManager). Esta rota antiga vira um atalho.
function EventoPerguntas() {
  const { id } = Route.useParams();
  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="font-serif text-2xl">Perguntas customizadas</h1>
      <div className="rounded-lg border bg-card p-5 space-y-2">
        <p className="text-sm">
          As perguntas customizadas do evento são gerenciadas direto na página do evento, junto com
          os outros dados.
        </p>
        <Link
          to="/eventos/$id"
          params={{ id }}
          className="inline-block rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
        >
          Abrir evento
        </Link>
      </div>
    </div>
  );
}
