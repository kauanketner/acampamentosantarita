import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="font-serif text-2xl">Santa Rita — Admin</p>
          <p className="text-sm text-muted-foreground mt-1">Acesso restrito</p>
        </div>
        {/* TODO: formulário (email, senha) → POST /v1/auth/login. Mostrar erros, esqueci a senha. */}
      </div>
    </div>
  );
}
