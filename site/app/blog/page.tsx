import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import { formatDateShort } from '@/lib/format';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Diário',
  description:
    'Cartas, ensaios e bilhetes da comunidade Acampamento Santa Rita. Reflexões espirituais, memórias e recados.',
};

// Conteúdo seed estático até a API CMS de posts ficar pronta.
// Cada post mantém o mesmo shape esperado da API.
const posts = [
  {
    slug: 'sobre-o-silencio-e-o-fogo',
    title: 'Sobre o silêncio e o fogo',
    excerpt:
      'O acampamento começa antes do acampamento. Começa quando alguém decide vir — e termina muito depois, quando começa a ser vivido.',
    author: 'Padre Tiago Andrade',
    publishedAt: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 12).toISOString(),
    category: 'Espiritualidade',
    coverGradient: 0,
  },
  {
    slug: 'cartas-de-uma-equipista',
    title: 'Cartas de uma equipista',
    excerpt:
      'Servir não é dar de si para quem precisa. Servir é descobrir, no outro, a face de quem chamou primeiro.',
    author: 'Mariana Coelho',
    publishedAt: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 4).toISOString(),
    category: 'Testemunhos',
    coverGradient: 1,
  },
  {
    slug: 'a-mesa-e-o-altar',
    title: 'A mesa e o altar',
    excerpt:
      'Sempre que comemos juntos, a comunidade nasce de novo. Sempre que rezamos juntos, a mesa fica pronta.',
    author: 'Coordenação',
    publishedAt: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 18).toISOString(),
    category: 'Comunidade',
    coverGradient: 2,
  },
  {
    slug: 'memoria-do-acampamento-xxi',
    title: 'Memória do Acampamento XXI',
    excerpt:
      'Foi o ano em que choveu três dias seguidos. Foi também o ano em que aprendemos que casa não tem teto — tem gente.',
    author: 'Lucas Pereira',
    publishedAt: new Date(new Date().getFullYear() - 1, 6, 28).toISOString(),
    category: 'Memória',
    coverGradient: 3,
  },
];

const categories = ['Todos', 'Espiritualidade', 'Testemunhos', 'Comunidade', 'Memória'];

export default function BlogPage() {
  return (
    <>
      <section className="relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, color-mix(in oklch, var(--color-gold) 8%, transparent), transparent 50%)',
          }}
        />
        <Container width="editorial" className="relative pt-12 lg:pt-20 pb-12">
          <div className="flex items-center gap-3 mb-8">
            <Logomark size={32} />
            <span className="eyebrow">Diário · Capítulos abertos</span>
          </div>

          <h1
            className="font-display leading-[0.98] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            Cartas, ensaios{' '}
            <span
              className="italic text-(color:--color-oxblood)"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              e bilhetes
            </span>{' '}
            da comunidade.
          </h1>
          <p className="mt-6 text-[16px] lg:text-[17px] text-(color:--color-ink-soft) max-w-2xl leading-relaxed text-pretty">
            Aqui guardamos o que vai sendo escrito ao longo do caminho. Reflexões espirituais,
            memórias, recados da coordenação. Sem pressa.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full border border-(color:--color-rule) px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-(color:--color-ink-faint) hover:bg-(color:--color-paper-2) hover:text-(color:--color-ink) cursor-default transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container width="editorial">
          <div className="space-y-px bg-(color:--color-rule)/60 paper-card rounded-(--radius-md) overflow-hidden">
            {posts.map((post, idx) => (
              <PostRow key={post.slug} post={post} feature={idx === 0} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function PostRow({
  post,
  feature,
}: {
  post: (typeof posts)[number];
  feature?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-(color:--color-paper) hover:bg-(color:--color-paper-2)/60 transition-colors"
    >
      <article
        className={`grid grid-cols-1 ${feature ? 'lg:grid-cols-[1.1fr_1fr]' : 'lg:grid-cols-[1fr_240px]'} gap-6 lg:gap-10 p-6 lg:p-10`}
      >
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <p className="eyebrow mb-3">
            {post.category} <span className="text-(color:--color-rule-strong)">·</span>{' '}
            <span className="tabular">{formatDateShort(post.publishedAt)}</span>
          </p>
          <h2
            className={`font-display leading-[1.05] tracking-tight text-(color:--color-ink) group-hover:text-(color:--color-oxblood) transition-colors ${
              feature ? 'text-[clamp(2rem,4vw,3.5rem)]' : 'text-[clamp(1.5rem,2.4vw,2rem)]'
            }`}
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            {post.title}
          </h2>
          <p
            className={`mt-4 text-(color:--color-ink-soft) leading-relaxed text-pretty ${feature ? 'text-[16px]' : 'text-[14px]'}`}
          >
            {post.excerpt}
          </p>
          <p className="mt-5 text-[12px] text-(color:--color-ink-faint) flex items-baseline justify-between border-t border-(color:--color-rule)/60 pt-4 lg:pt-5">
            <span>Por {post.author}</span>
            <span className="text-(color:--color-oxblood) underline-thin">Continuar lendo →</span>
          </p>
        </div>

        <div
          className={
            'relative aspect-[5/4] lg:aspect-auto lg:min-h-[200px] order-1 lg:order-2 vignette overflow-hidden rounded-(--radius-sm)'
          }
          style={{ background: gradientForCover(post.coverGradient) }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display italic text-(color:--color-paper)/60 text-[clamp(3rem,8vw,5rem)] leading-none select-none"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              aria-hidden
            >
              {post.title.charAt(0)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

const palettes = [
  'linear-gradient(135deg, oklch(0.36 0.13 22), oklch(0.5 0.13 30))',
  'linear-gradient(135deg, oklch(0.42 0.07 130), oklch(0.55 0.09 110))',
  'linear-gradient(135deg, oklch(0.6 0.13 70), oklch(0.45 0.12 50))',
  'linear-gradient(135deg, oklch(0.3 0.1 25), oklch(0.4 0.12 35))',
] as const;

function gradientForCover(i: number): string {
  return palettes[i % palettes.length] ?? palettes[0];
}
