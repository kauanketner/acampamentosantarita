import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/comunicacao/push')({
  component: Push,
});

function Push() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Push</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: visão das push subscriptions ativas, taxa de entrega dos últimos
            envios, painel para teste rápido. */}
      </p>
    </div>
  );
}
