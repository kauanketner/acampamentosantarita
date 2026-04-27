import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/pessoas/nova')({
  component: NovaPessoa,
});

function NovaPessoa() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Nova pessoa</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: form simplificado (admin pode pular passos do app).
            Possibilidade de cadastrar veterano com histórico legado. */}
      </p>
    </div>
  );
}
