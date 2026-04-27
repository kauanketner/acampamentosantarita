type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <article className="container max-w-2xl py-16 px-6 prose prose-stone">
      <h1>{/* TODO: título via GET /public/posts/:slug */}Post — {slug}</h1>
      {/* TODO: corpo do post, autor, data de publicação. */}
    </article>
  );
}
