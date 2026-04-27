import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/galeria/$slug')({
  component: AlbumDetalhe,
});

function AlbumDetalhe() {
  return (
    <div>
      <TopBar title="Álbum" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: grid de fotos com lightbox em tela cheia. */}
        </p>
      </div>
    </div>
  );
}
