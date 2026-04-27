import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/pessoas/')({
  component: PessoasIndex,
});

function PessoasIndex() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Pessoas</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: tabela com filtros (cidade, idade, gênero, primeira vez, equipista),
            busca por nome/CPF, badge de quantos acampamentos a pessoa fez. CTA "Nova". */}
      </p>
    </div>
  );
}
