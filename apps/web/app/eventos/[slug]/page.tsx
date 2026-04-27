type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventoDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <section className="container max-w-3xl py-16 px-6">
      <h1 className="font-serif text-4xl mb-8">
        {/* TODO: título do evento via GET /public/event/:slug */}
        Evento — {slug}
      </h1>
      <p className="text-muted-foreground">
        {/* TODO: descrição contemplativa, datas, local, CTA "Inscreva-se pelo app". */}
      </p>
    </section>
  );
}
