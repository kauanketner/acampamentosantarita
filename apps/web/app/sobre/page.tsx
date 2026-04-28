import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import { toRoman } from '@/lib/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre a comunidade',
  description:
    'A história, a missão e os frutos da comunidade Acampamento Santa Rita — desde 2003 dizendo sim, juntos.',
};

const milestones = [
  {
    year: '2003',
    title: 'O primeiro fogo',
    body: 'Um pequeno grupo de jovens da Paróquia Santa Rita das Cássia decide passar quatro dias num sítio em Atibaia. Sem nome, sem programa pronto, só com um padre e um violão. No fim, todos sabiam que aquilo iria continuar.',
  },
  {
    year: '2008',
    title: 'A primeira equipe',
    body: 'Cinco anos depois, quem voltava começou a servir. Nasce o conceito de equipista — gente que não vem para ser servida, mas para servir. A comunidade passa a ter espinha dorsal.',
  },
  {
    year: '2014',
    title: 'Para além do verão',
    body: 'Os retiros de Quaresma e de Páscoa começam a acontecer. Encontros mensais, formações, casamentos da comunidade. O acampamento deixa de ser evento e vira modo de viver.',
  },
  {
    year: '2020',
    title: 'A travessia',
    body: 'Em meio à pandemia, a comunidade não se calou — rezou em casa, cuidou dos mais velhos, fez doação de cestas. Quando voltamos a nos encontrar, sabíamos que tudo era novo.',
  },
  {
    year: '2026',
    title: 'A vinte e segunda edição',
    body: 'Hoje somos uma comunidade com mais de 4.800 pessoas que passaram pelos acampamentos, retiros e encontros. Cada nome continua sendo uma alma.',
  },
];

const fruits = [
  { label: 'Casamentos', number: '38', sub: 'que nasceram aqui' },
  { label: 'Vocações religiosas', number: '12', sub: 'sacerdotes e consagradas' },
  {
    label: 'Filhos da comunidade',
    number: '60+',
    sub: 'crianças nascidas em famílias do acampamento',
  },
  { label: 'Comunidades-irmãs', number: '04', sub: 'inspiradas pela nossa' },
];

export default function SobrePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, color-mix(in oklch, var(--color-gold) 8%, transparent), transparent 40%)',
          }}
        />
        <div
          aria-hidden
          className="absolute -left-32 top-32 size-[420px] rounded-full bg-(color:--color-oxblood)/8 blur-3xl"
        />

        <Container width="editorial" className="relative pt-12 lg:pt-20 pb-16 lg:pb-24">
          <div className="flex items-center gap-3 mb-8">
            <Logomark size={22} tone="oxblood" />
            <span className="eyebrow">Capítulo zero · A comunidade</span>
          </div>

          <h1
            className="font-display leading-[0.98] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.5rem, 7.2vw, 5.75rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            Há mais de duas décadas{' '}
            <span
              className="italic text-(color:--color-oxblood)"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              dizendo sim,
            </span>{' '}
            juntos.
          </h1>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-7">
              <p
                className="drop-cap font-display text-[19px] lg:text-[20px] leading-[1.7] text-(color:--color-ink) text-pretty"
                style={{ fontVariationSettings: "'opsz' 32, 'SOFT' 40" }}
              >
                A comunidade Acampamento Santa Rita nasceu pequena — e quis ficar pequena. Não somos
                um movimento, não somos uma instituição. Somos um grupo de pessoas que se reúne em
                torno do mesmo Deus, do mesmo fogo, do mesmo silêncio. Nossa missão cabe numa frase:
                cuidar de quem chega como se fosse o único que chegasse, porque cada nome é uma
                alma, e cada alma é a inteira.
              </p>
            </div>
            <aside className="lg:col-span-5 space-y-4">
              <div className="paper-card rounded-(--radius-md) p-6">
                <p className="eyebrow mb-3">Sob a intercessão de</p>
                <p
                  className="font-display italic text-3xl leading-tight text-(color:--color-oxblood)"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
                >
                  Santa Rita das Cássia
                </p>
                <p className="text-[13px] text-(color:--color-ink-soft) leading-relaxed mt-3">
                  Padroeira das causas impossíveis. Nasceu em Cássia, Itália, no século XIV. Foi
                  esposa, mãe, viúva e religiosa — em todos os estados, modelo de paciência, perdão
                  e amor.
                </p>
              </div>
              <div className="paper-card rounded-(--radius-md) p-6">
                <p className="eyebrow mb-3">Onde estamos</p>
                <p
                  className="font-display text-2xl leading-tight tracking-tight"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                >
                  Paróquia Santa Rita das Cássia
                </p>
                <p className="text-[13px] text-(color:--color-ink-soft) mt-2">
                  São Paulo · SP · Brasil
                </p>
                <p className="text-[12px] text-(color:--color-ink-faint) mt-3 leading-relaxed">
                  Os acampamentos acontecem em retiros próximos. A comunidade se encontra
                  mensalmente para formação e oração.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="relative py-24 lg:py-32 bg-(color:--color-paper-2)/60 border-y border-(color:--color-rule)">
        <Container width="editorial">
          <header className="mb-16 max-w-2xl">
            <p className="eyebrow mb-3">Linha do tempo</p>
            <h2
              className="font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] tracking-tight"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
            >
              <span>Vinte e três anos </span>
              <span
                className="italic text-(color:--color-oxblood)"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              >
                em poucas linhas.
              </span>
            </h2>
          </header>

          <ol className="relative space-y-12 lg:space-y-16 ml-4 lg:ml-0">
            <span
              aria-hidden
              className="absolute lg:left-[120px] left-0 top-2 bottom-2 w-px bg-(color:--color-rule)"
            />
            {milestones.map((m, i) => (
              <li
                key={m.year}
                className="relative grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-4 lg:gap-12 pl-8 lg:pl-0"
              >
                <span
                  aria-hidden
                  className="absolute left-[-3px] lg:left-[117px] top-2 size-1.5 rounded-full bg-(color:--color-oxblood) ring-4 ring-(color:--color-paper-2)"
                />
                <div className="lg:text-right">
                  <p
                    className="font-display text-3xl leading-none tracking-tight text-(color:--color-oxblood) tabular"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
                  >
                    {m.year}
                  </p>
                  <p className="eyebrow mt-2">Capítulo {toRoman(i + 1)}</p>
                </div>
                <div>
                  <h3
                    className="font-display text-2xl leading-tight tracking-tight"
                    style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
                  >
                    {m.title}
                  </h3>
                  <p className="text-[15px] text-(color:--color-ink-soft) leading-relaxed mt-3 max-w-xl text-pretty">
                    {m.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="relative py-24 lg:py-32">
        <Container width="editorial">
          <header className="mb-16 max-w-2xl">
            <p className="eyebrow mb-3">Os frutos da árvore</p>
            <h2
              className="font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] tracking-tight"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60" }}
            >
              O que se{' '}
              <span
                className="italic text-(color:--color-oxblood)"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              >
                colhe.
              </span>
            </h2>
            <p className="mt-4 text-(color:--color-ink-soft) max-w-xl leading-relaxed">
              Não são números. São histórias. Mas como contar histórias dá tempo, deixamos os
              números aqui — pra dar uma ideia do que acontece quando uma comunidade reza junta há
              vinte anos.
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-(color:--color-rule)/60 paper-card rounded-(--radius-md) overflow-hidden">
            {fruits.map((f) => (
              <div key={f.label} className="bg-(color:--color-paper) p-6 lg:p-8">
                <p
                  className="font-display text-(color:--color-oxblood) leading-none tabular"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                  }}
                >
                  {f.number}
                </p>
                <p className="text-[14px] font-medium text-(color:--color-ink) mt-3 leading-tight">
                  {f.label}
                </p>
                <p className="text-[11px] text-(color:--color-ink-faint) mt-1.5 leading-relaxed">
                  {f.sub}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative py-24 lg:py-32 bg-(color:--color-paper-2)/60 border-t border-(color:--color-rule)">
        <Container width="reading" className="text-center">
          <p className="eyebrow mb-6">Convite</p>
          <p className="pull-quote text-(color:--color-ink) max-w-2xl mx-auto">
            Se você chegou até aqui, talvez não seja por acaso. A comunidade está aberta. Venha
            conhecer — sem cerimônia, sem pressa.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="/eventos" size="lg">
              Ver próximos eventos
            </Button>
            <Button href="/contato" size="lg" variant="outline">
              Falar com a coordenação
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
