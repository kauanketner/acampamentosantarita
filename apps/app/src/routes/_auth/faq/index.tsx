import { createFileRoute } from '@tanstack/react-router';
import { Page } from '@/components/shell/Page';
import { PageHeader } from '@/components/shell/PageHeader';
import { SectionTitle } from '@/components/shell/SectionTitle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faq } from '@/mock/data';

export const Route = createFileRoute('/_auth/faq/')({
  component: FaqIndex,
});

function FaqIndex() {
  // group by category
  const grouped = faq.reduce<Record<string, typeof faq>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category]!.push(item);
    return acc;
  }, {});

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

      <div className="grid gap-4 pb-8">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <SectionTitle>{category}</SectionTitle>
            <div className="px-5">
              <Accordion type="single" collapsible className="surface-warmth rounded-(--radius-lg) border border-(color:--color-border) px-5">
                {items.map((q) => (
                  <AccordionItem key={q.id} value={q.id}>
                    <AccordionTrigger>{q.question}</AccordionTrigger>
                    <AccordionContent>{q.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        ))}
      </div>

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
