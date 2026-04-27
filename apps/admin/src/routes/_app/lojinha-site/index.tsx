import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/lojinha-site/')({
  component: LojinhaSite,
});

function LojinhaSite() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Lojinha do Site</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: CRUD de shop_products (catálogo público). Cada produto tem template
            de mensagem WhatsApp pré-formatada. */}
      </p>
    </div>
  );
}
