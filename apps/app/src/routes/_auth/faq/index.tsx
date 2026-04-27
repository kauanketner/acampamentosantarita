import { createFileRoute } from '@tanstack/react-router';
import { TopBar } from '@/components/layout/TopBar';

export const Route = createFileRoute('/_auth/faq/')({
  component: FaqIndex,
});

function FaqIndex() {
  return (
    <div>
      <TopBar title="FAQ" />
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {/* TODO: lista de faq_items por categoria (accordion). */}
        </p>
      </div>
    </div>
  );
}
