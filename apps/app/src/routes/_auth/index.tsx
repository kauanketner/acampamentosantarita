import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <TopBar />
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-xl font-bold">Início</h1>
        <p className="text-sm text-muted-foreground">
          {/* TODO: card do próximo evento com inscrição aberta, atalhos para minhas
              inscrições, último aviso publicado, tribo (se revelada), conta PDV
              do evento atual (se aberta). */}
        </p>
      </div>
    </div>
  );
}
