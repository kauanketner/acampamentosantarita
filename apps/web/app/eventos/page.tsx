export default function EventosPage() {
  return (
    <section className="container max-w-5xl py-16 px-6">
      <h1 className="font-serif text-4xl mb-2">Próximos eventos</h1>
      <p className="text-muted-foreground mb-12">
        {/* TODO: subtítulo discreto. Lista pública dos próximos eventos com inscrições abertas. */}
      </p>
      {/* TODO: GET /public/upcoming-events. Cada card: cover, nome, data, local,
          status de inscrição. CTA "Inscreva-se pelo app" → app.acampamentosantarita.com.br. */}
    </section>
  );
}
