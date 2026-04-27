import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/comunicacao/avisos')({
  component: Avisos,
});

function Avisos() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Avisos</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: composição de aviso (título, corpo, imagem, audiência: todos /
            participantes do evento / equipistas / tribo X / equipe X). Toggle
            "Enviar push" e "Vincular a evento". */}
      </p>
    </div>
  );
}
