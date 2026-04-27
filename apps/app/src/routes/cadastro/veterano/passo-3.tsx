import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cadastro/veterano/passo-3')({
  component: PassoTres,
});

function PassoTres() {
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <p className="text-xs text-muted-foreground">Passo 3 de 6</p>
      <h1 className="text-xl font-bold mt-1">Contatos de emergência</h1>
      <p className="text-sm text-muted-foreground mt-2">
        {/* TODO: idêntico ao /primeira-vez/passo-3. */}
      </p>
    </div>
  );
}
