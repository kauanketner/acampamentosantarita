import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/eventos/$slug')({
  component: EventoDetalhe,
});

function EventoDetalhe() {
  const { slug } = Route.useParams();
  return (
    <div>
      <TopBar title="Evento" />
      <div className="px-4 py-4">
        <p className="text-xs text-muted-foreground">{slug}</p>
        <p className="text-sm mt-2">
          {/* TODO: cover, descrição, datas, local, valores (campista/equipista),
              prazo. CTA grande "Inscrever-me". */}
        </p>
      </div>
    </div>
  );
}
