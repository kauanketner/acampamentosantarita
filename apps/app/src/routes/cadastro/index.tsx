import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cadastro/')({
  component: CadastroEscolha,
});

function CadastroEscolha() {
  return (
    <div className="min-h-screen flex flex-col px-6 py-10">
      <div className="text-center mb-10">
        <p className="font-serif text-2xl">Bem-vindo</p>
        <p className="text-sm text-muted-foreground mt-1 italic">Antes de começar…</p>
      </div>

      <p className="text-base mb-8 text-center">
        É a sua primeira vez no Santa Rita?
      </p>

      <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
        <Link
          to="/cadastro/primeira-vez/passo-1"
          className="rounded-xl border bg-primary text-primary-foreground px-5 py-4 text-center font-medium"
        >
          Sim, primeira vez
        </Link>
        <Link
          to="/cadastro/veterano/passo-1"
          className="rounded-xl border bg-secondary px-5 py-4 text-center font-medium"
        >
          Já participei antes
        </Link>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8 max-w-sm mx-auto">
        {/* TODO: copy curta explicando que veteranos vão declarar histórico legado
            (acampamentos passados, tribo, função). */}
      </p>
    </div>
  );
}
