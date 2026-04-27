import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-4')({
  component: PassoQuatro,
});

function PassoQuatro() {
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <p className="text-xs text-muted-foreground">Passo 4 de 5</p>
      <h1 className="text-xl font-bold mt-1">Vida de fé</h1>
      <p className="text-sm text-muted-foreground mt-2">
        {/* TODO: religião, paróquia, grupo, sacramentos recebidos (multi-select). */}
      </p>
    </div>
  );
}
