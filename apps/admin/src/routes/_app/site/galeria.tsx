import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/site/galeria')({
  component: SiteGaleria,
});

function SiteGaleria() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Galeria</h1>
      <p className="text-muted-foreground mt-2">
        {/* TODO: gestão de gallery_albums + gallery_photos. Upload em lote para R2,
            reorder via drag-and-drop, vincular a evento. */}
      </p>
    </div>
  );
}
