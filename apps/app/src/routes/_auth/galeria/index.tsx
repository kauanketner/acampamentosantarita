import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/galeria/')({
  component: GaleriaIndex,
});

function GaleriaIndex() {
  return (
    <div>
      <TopBar title="Galeria" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: grid de álbuns publicados (cover, nome, ano). */}
        </p>
      </div>
    </div>
  );
}
