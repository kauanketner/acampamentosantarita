import { createFileRoute } from '@tanstack/react-router';
import { HelpCircle, Loader2 } from 'lucide-react';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { SectionTitle } from '@/components/shell/SectionTitle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { EmptyState } from '@/components/ui/empty-state';
import { useFaq } from '@/lib/queries/cms';

export const Route = createFileRoute('/_auth/faq/')({
  component: FaqIndex,
});

const UNCATEGORIZED = 'Outros';

function FaqIndex() {
  const { data: faq, isLoading, isError } = useFaq();

  return (
    <Page>
      <div className="safe-top" />
      <PageHeader
        eyebrow="Para te ajudar"
        title={
          <>
            Perguntas <span className="font-display-italic">frequentes.</span>
          </>
        }
        className="pt-12"
      />

      {isLoading && (
        <div className="flex justify-center py-16 text-(color:--color-muted-foreground)">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {isError && (
        <EmptyState
          className="py-16"
          icon={<HelpCircle className="size-10" strokeWidth={1.2} />}
          title="Não conseguimos buscar"
          description="Tente daqui a pouco."
        />
      )}

      {faq && faq.length === 0 && (
        <EmptyState
          className="py-16"
          icon={<HelpCircle className="size-10" strokeWidth={1.2} />}
          title="Sem perguntas por aqui"
          description="Em breve a coordenação publica respostas para as dúvidas mais comuns."
        />
      )}

      {faq && faq.length > 0 && <FaqContent items={faq} />}

      <div className="px-5 pb-4 text-center">
        <p className="text-sm text-(color:--color-muted-foreground)">
          Não achou? Escreva para{' '}
          <a
            href="mailto:contato@acampamentosantarita.com.br"
            className="text-(color:--color-primary) underline"
          >
            contato@acampamentosantarita.com.br
          </a>
        </p>
      </div>
    </Page>
  );
}

function FaqContent({ items }: { items: ReturnType<typeof useFaq>['data'] }) {
  if (!items) return null;
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const cat = item.category && item.category.trim() ? item.category : UNCATEGORIZED;
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(item);
    return acc;
  }, {});

  return (
    <div className="grid gap-4 pb-8">
      {Object.entries(grouped).map(([category, list]) => (
        <section key={category}>
          <SectionTitle>{category}</SectionTitle>
          <div className="px-5">
            <Accordion
              type="single"
              collapsible
              className="surface-warmth rounded-(--radius-lg) border border-(color:--color-border) px-5"
            >
              {list.map((q) => (
                <AccordionItem key={q.id} value={q.id}>
                  <AccordionTrigger>{q.question}</AccordionTrigger>
                  <AccordionContent>
                    <span className="whitespace-pre-line">{q.answer}</span>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      ))}
    </div>
  );
}
