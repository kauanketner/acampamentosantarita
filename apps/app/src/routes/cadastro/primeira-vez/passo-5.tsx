import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cadastro/primeira-vez/passo-5')({
  component: PassoCinco,
});

function PassoCinco() {
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <p className="text-xs text-muted-foreground">Passo 5 de 5</p>
      <h1 className="text-xl font-bold mt-1">Saúde</h1>
      <p className="text-sm text-muted-foreground mt-2">
        {/* TODO: 19 perguntas (ver health_profiles). Toggles bool com campos
            de detalhe condicionais. Campos de texto longo no fim
            (medicações contínuas, restrições, observações). */}
      </p>
    </div>
  );
}
