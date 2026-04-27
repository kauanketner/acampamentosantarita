import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="font-serif text-3xl">Santa Rita</p>
          <p className="text-sm text-muted-foreground italic mt-1">Viva seu momento.</p>
        </div>
        {/* TODO: form (email, senha) → POST /v1/auth/login. */}
        <p className="text-center text-sm">
          Primeira vez na comunidade?{' '}
          <Link to="/cadastro" className="text-primary underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
