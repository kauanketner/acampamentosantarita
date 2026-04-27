import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/$id/perguntas')({
  component: EventoPerguntas,
});

function EventoPerguntas() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Perguntas customizadas</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: CRUD de event_custom_questions. Drag-and-drop de ordem.
            Opções por tipo (text/textarea/select/multi_select/bool/number/date).
            Audiência: campista/equipista/ambos. */}
      </p>
    </div>
  );
}
