import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/avisos/')({
  component: AvisosIndex,
});

function AvisosIndex() {
  return (
    <div>
      <TopBar title="Avisos" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: GET /v1/communication/notifications/me. Lista cronológica
              com indicador "não lido". Tap marca como lida (POST mark-read). */}
        </p>
      </div>
    </div>
  );
}
