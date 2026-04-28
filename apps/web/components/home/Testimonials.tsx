import { Container } from '@/components/ui/Container';

const testimonials = [
  {
    quote:
      'Eu cheguei no acampamento sem fé. Voltei sem entender o que tinha acontecido — só sabia que algo, dentro de mim, tinha mudado de lugar.',
    author: 'Mariana Coelho',
    context: 'Campista · 2018',
  },
  {
    quote:
      'A comunidade me ensinou que a oração não é monólogo — é casa cheia. Aqui aprendi a rezar com gente do meu lado.',
    author: 'Padre Tiago Andrade',
    context: 'Direção espiritual',
  },
  {
    quote:
      'Servir como equipista mudou meu trabalho, meu casamento, minha vida inteira. O acampamento não acaba quando a gente desmonta a barraca.',
    author: 'Lucas Pereira',
    context: 'Equipista desde 2011',
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-(color:--color-ink) text-(color:--color-paper) overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '14px 14px',
        }}
      />
      <div
        aria-hidden
        className="absolute -top-40 -right-40 size-[480px] rounded-full bg-(color:--color-oxblood)/40 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 size-[420px] rounded-full bg-(color:--color-gold)/15 blur-3xl pointer-events-none"
      />

      <Container width="wide" className="relative">
        <div className="max-w-2xl mb-14 lg:mb-20">
          <p className="eyebrow text-(color:--color-paper)/55 mb-3">
            Capítulo IV · Vozes da comunidade
          </p>
          <h2
            className="font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] tracking-tight"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
          >
            <span className="block">Quem passou,</span>
            <span
              className="block italic text-(color:--color-gold)"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              não sai o mesmo.
            </span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {testimonials.map((t, _i) => (
            <li key={t.author} className="relative pl-6">
              <span
                aria-hidden
                className="absolute left-0 top-0 font-display italic text-5xl text-(color:--color-gold) leading-none"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              >
                “
              </span>
              <blockquote
                className="font-display italic text-[20px] lg:text-[22px] leading-[1.4] text-(color:--color-paper)/92 tracking-[-0.005em]"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 90" }}
              >
                {t.quote}
              </blockquote>
              <footer className="mt-5 pt-4 border-t border-(color:--color-paper)/15">
                <p className="text-[13px] font-medium text-(color:--color-paper)">{t.author}</p>
                <p className="text-[11px] text-(color:--color-paper)/50 mt-0.5">{t.context}</p>
              </footer>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
