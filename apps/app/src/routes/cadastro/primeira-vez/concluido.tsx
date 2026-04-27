import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cadastro/primeira-vez/concluido')({
  component: Concluido,
});

function Concluido() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-serif text-3xl">Pronto.</p>
      <p className="italic text-muted-foreground mt-2">Seu cadastro foi recebido.</p>
      {/* TODO: convite discreto pra explorar próximos eventos. */}
      <Link
        to="/"
        className="mt-10 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm"
      >
        Continuar
      </Link>
    </div>
  );
}
