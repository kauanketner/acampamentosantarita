import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/tribo/')({
  component: TriboPage,
});

function TriboPage() {
  return (
    <div>
      <TopBar title="Minha tribo" />
      <div className="px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground italic">
          {/* TODO: GET /v1/tribes/me/current. Se não revelado: mostrar mensagem
              contemplativa "ao final do evento, você descobrirá".
              Se revelado: mostrar nome da tribo, lema, cor, foto, líderes,
              colegas de tribo. */}
          Ao final do evento, você descobrirá.
        </p>
      </div>
    </div>
  );
}
