import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/site/paginas')({
  component: SitePaginas,
});

function SitePaginas() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Páginas</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: CRUD de pages (sobre, política, termos, etc.). Editor de blocos
            de conteúdo. SEO (title, description). */}
      </p>
    </div>
  );
}
