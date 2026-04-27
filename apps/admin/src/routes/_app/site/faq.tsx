import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/site/faq')({
  component: SiteFaq,
});

function SiteFaq() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">FAQ</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: CRUD de faq_items por categoria, com ordenação. */}
      </p>
    </div>
  );
}
