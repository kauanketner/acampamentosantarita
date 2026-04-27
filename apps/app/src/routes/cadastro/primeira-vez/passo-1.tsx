import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-1')({
  component: PassoUm,
});

function PassoUm() {
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <p className="text-xs text-muted-foreground">Passo 1 de 5</p>
      <h1 className="text-xl font-bold mt-1">Dados pessoais</h1>
      <p className="text-sm text-muted-foreground mt-2">
        {/* TODO: form com nome completo, sexo, data de nascimento, CPF, estado civil,
            altura, peso, tamanho de camiseta, foto de perfil. CTA "Próximo". */}
      </p>
    </div>
  );
}
