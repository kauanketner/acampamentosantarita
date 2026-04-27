import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/eventos/$slug/inscricao/')({
  component: InscricaoForm,
});

function InscricaoForm() {
  return (
    <div>
      <TopBar title="Inscrição" />
      <div className="px-4 py-4 space-y-6">
        <section>
          <h2 className="font-medium">Sou…</h2>
          <p className="text-sm text-muted-foreground">
            {/* TODO: roleIntent (campista/equipista). Bloquear "campista" se a
                pessoa já tem participações anteriores (quando event.allow_first_timer=true). */}
          </p>
        </section>
        <section>
          <h2 className="font-medium">Revisão de saúde</h2>
          <p className="text-sm text-muted-foreground">
            {/* TODO: mostrar o health_profile atual com todos os campos editáveis.
                Submit atualiza last_reviewed_at e cria o snapshot na inscrição. */}
          </p>
        </section>
        <section>
          <h2 className="font-medium">Perguntas do evento</h2>
          <p className="text-sm text-muted-foreground">
            {/* TODO: render dinâmico das event_custom_questions filtradas por audience. */}
          </p>
        </section>
      </div>
    </div>
  );
}
