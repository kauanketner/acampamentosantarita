import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import type * as React from 'react';

type Props = {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro?: React.ReactNode;
  sections: Array<{ title: string; body: string[] }>;
};

export function LegalPage({ eyebrow, title, updatedAt, intro, sections }: Props) {
  return (
    <>
      <section className="relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, color-mix(in oklch, var(--color-gold) 6%, transparent), transparent 50%)',
          }}
        />
        <Container width="reading" className="relative pt-12 lg:pt-20 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <Logomark size={20} tone="oxblood" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h1
            className="font-display leading-[1.02] tracking-[-0.02em] text-(color:--color-ink) text-balance"
            style={{
              fontSize: 'clamp(2rem, 5.6vw, 4rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            {title}
          </h1>
          <p className="mt-4 text-[12px] text-(color:--color-ink-faint) tabular">
            Última atualização · {updatedAt}
          </p>
          {intro && (
            <div className="mt-6 text-[15px] lg:text-[16px] text-(color:--color-ink-soft) leading-[1.7] text-pretty">
              {intro}
            </div>
          )}
        </Container>
      </section>

      <article className="pb-24 lg:pb-32">
        <Container width="reading">
          <div className="space-y-12">
            {sections.map((section, idx) => (
              <section key={section.title}>
                <h2
                  className="font-display text-2xl lg:text-3xl tracking-tight leading-tight text-(color:--color-ink) flex items-baseline gap-3"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                >
                  <span
                    className="font-display italic text-(color:--color-oxblood) text-xl tabular"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 70" }}
                  >
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 text-[15px] lg:text-[16px] text-(color:--color-ink-soft) leading-[1.75] text-pretty space-y-4">
                  {section.body.map((para, j) => (
                    <p key={`${section.title}-${j}`}>{para}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16">
            <div className="ornament">
              <span className="text-(color:--color-accent-deep)">❀</span>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
