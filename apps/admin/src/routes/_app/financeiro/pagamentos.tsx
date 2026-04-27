import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/financeiro/pagamentos')({
  component: Pagamentos,
});

function Pagamentos() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Pagamentos</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: lista de payments com método, valor, data, fatura associada.
            Conciliação manual com extratos quando necessário. */}
      </p>
    </div>
  );
}
