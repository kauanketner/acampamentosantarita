import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/eventos/$id/tribos')({
  component: EventoTribos,
});

function EventoTribos() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tribos</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: gestão das tribos do evento (CRUD), atribuição de campistas
            (sortear ou manual), líderes/vice-líderes. Botão "Revelar tribos"
            disponível só quando event.status='finalizado'. */}
      </p>
    </div>
  );
}
