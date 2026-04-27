import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/site/home')({
  component: SiteHome,
});

function SiteHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Home do site</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: editor visual dos home_blocks (hero, números, depoimentos, gallery,
            cta, text). Drag-and-drop de ordem. */}
      </p>
    </div>
  );
}
