type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AlbumDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <section className="container max-w-6xl py-16 px-6">
      <h1 className="font-serif text-4xl mb-8">
        {/* TODO: nome do álbum */}Álbum — {slug}
      </h1>
      {/* TODO: GET /public/gallery/:slug. Grid de fotos com lightbox. */}
    </section>
  );
}
