import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/eventos/$slug/inscricao/confirmado')({
  component: InscricaoConfirmado,
});

function InscricaoConfirmado() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-serif text-3xl">Sua inscrição foi recebida.</p>
      <p className="italic text-muted-foreground mt-2">
        {/* TODO: copy curta — "te avisamos quando confirmada". */}
      </p>
      <Link
        to="/minhas-inscricoes"
        className="mt-10 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm"
      >
        Minhas inscrições
      </Link>
    </div>
  );
}
