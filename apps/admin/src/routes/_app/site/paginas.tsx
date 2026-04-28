import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/site/paginas')({
  component: SitePaginas,
});

// Páginas estáticas (sobre, política, termos) podem ser tratadas via
// arquivos no apps/web (Next.js). A tabela `pages` no schema fica pronta
// pra um CMS visual no futuro, mas por enquanto este atalho.
function SitePaginas() {
  return (
    <div className="p-6 max-w-3xl space-y-4">
      <h1 className="font-serif text-2xl">Páginas estáticas</h1>
      <div className="rounded-lg border bg-card p-5 space-y-2">
        <p className="text-sm">
          Páginas como <em>Sobre</em>, <em>Política de privacidade</em> e <em>Termos de uso</em>{' '}
          ficam direto no código do site público (<span className="font-mono">apps/web</span>). O
          editor visual com blocos é um item futuro do roadmap.
        </p>
        <p className="text-sm text-muted-foreground">
          Pra conteúdo dinâmico que muda com frequência (avisos, promoções, galeria, FAQ, posts),
          use os blocos da home, posts e os outros módulos:
        </p>
        <ul className="text-sm text-muted-foreground list-disc list-inside ml-2 space-y-1">
          <li>
            <Link to="/site/home" className="text-primary underline">
              Home
            </Link>{' '}
            (blocos visuais da landing page)
          </li>
          <li>
            <Link to="/site/posts" className="text-primary underline">
              Posts
            </Link>{' '}
            (blog do site)
          </li>
          <li>
            <Link to="/site/galeria" className="text-primary underline">
              Galeria
            </Link>{' '}
            (álbuns de fotos)
          </li>
          <li>
            <Link to="/site/faq" className="text-primary underline">
              FAQ
            </Link>{' '}
            (perguntas frequentes)
          </li>
        </ul>
      </div>
    </div>
  );
}
