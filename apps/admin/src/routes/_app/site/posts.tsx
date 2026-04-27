import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/site/posts')({
  component: SitePosts,
});

function SitePosts() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Posts (blog)</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: CRUD de posts. Editor markdown ou rich text. Capa via R2.
            Tags, autor, data de publicação. */}
      </p>
    </div>
  );
}
