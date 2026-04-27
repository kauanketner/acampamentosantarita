export default function LojinhaPage() {
  return (
    <section className="container max-w-5xl py-16 px-6">
      <h1 className="font-serif text-4xl mb-2">Lojinha</h1>
      <p className="text-muted-foreground mb-12">
        {/* TODO: linha curta. Sem checkout — só catálogo. */}
      </p>
      {/* TODO: GET /public/shop-products. Cada card abre WhatsApp com mensagem
          pré-formatada (process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER). */}
    </section>
  );
}
