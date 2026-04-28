import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';

const pillars = [
  {
    numeral: 'I',
    title: 'Encontro',
    body: 'Não somos um curso, nem um programa. Somos pessoas que se reúnem com calma, em torno do mesmo fogo, da mesma palavra, do mesmo silêncio. O encontro é o coração de tudo.',
  },
  {
    numeral: 'II',
    title: 'Comunhão',
    body: 'A comunidade não nasce de regras, nasce de mesas. Comemos juntos, cantamos juntos, choramos juntos. Quem chega volta — porque encontrou casa.',
  },
  {
    numeral: 'III',
    title: 'Missão',
    body: 'O que vivemos no acampamento não cabe entre as quatro paredes da capela. Volta com a gente para o cotidiano: a família, o trabalho, a rua. É lá que o sim se prova.',
  },
];

export function Manifesto() {
  return (
    <section className="relative py-24 lg:py-32">
      <Container width="wide">
        <Chapter
          numeral="I"
          eyebrow="Capítulo um · O que somos"
          title={
            <>
              Três palavras que nos guiam{' '}
              <span
                className="italic text-(color:--color-oxblood)"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              >
                desde o começo.
              </span>
            </>
          }
          description="Há quem chame de pilares. Preferimos chamar de portas. São por onde se entra e por onde se sai — sempre transformado."
          align="left"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 lg:gap-x-16 stagger">
          {pillars.map((p) => (
            <article
              key={p.numeral}
              className="relative pl-6 border-l border-(color:--color-rule-strong)/60 animate-drift-up"
            >
              <span
                aria-hidden
                className="absolute -left-px top-0 h-12 w-[2px] bg-(color:--color-oxblood)"
              />
              <p className="roman text-3xl leading-none mb-4">{p.numeral}.</p>
              <h3
                className="font-display text-3xl leading-tight tracking-tight text-(color:--color-ink) mb-3"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
              >
                {p.title}
              </h3>
              <p className="text-[15px] leading-[1.65] text-(color:--color-ink-soft) text-pretty">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
