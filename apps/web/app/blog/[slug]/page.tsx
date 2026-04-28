import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { formatDate } from '@/lib/format';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Conteúdo seed — espelho do que está em /blog até a API CMS ficar pronta.
const posts: Record<
  string,
  {
    title: string;
    excerpt: string;
    body: string[];
    author: string;
    authorTitle: string;
    publishedAt: string;
    category: string;
    readingMinutes: number;
  }
> = {
  'sobre-o-silencio-e-o-fogo': {
    title: 'Sobre o silêncio e o fogo',
    excerpt:
      'O acampamento começa antes do acampamento. Começa quando alguém decide vir — e termina muito depois, quando começa a ser vivido.',
    body: [
      'O acampamento começa antes do acampamento. Começa quando alguém, no meio de uma noite qualquer, sente que algo dentro de si pede silêncio. Não é silêncio de quem foge do barulho — é silêncio de quem quer ouvir. É a primeira centelha de um fogo que ainda não tem nome.',
      'Quando essa pessoa decide vir, ela já entrou. Não importa se a inscrição ainda não foi feita, se o pagamento ainda não foi confirmado, se a mochila ainda não foi arrumada. O que importa é que houve um sim — pequeno, frágil, talvez até secreto. E a comunidade reza por esses sins, porque sabe quanto custa cada um deles.',
      'Há uma coisa que dizemos com frequência por aqui: cada nome é uma alma. Não é frase de efeito, é exercício de oração. Quando a coordenação aprova uma inscrição, ela está dizendo sim de volta. Está dizendo: nós te esperamos. Está dizendo: tem lugar pra você nessa mesa.',
      'O fogo começa baixinho. Os primeiros dias do acampamento são quase silenciosos — gente que não se conhece, gente que não sabe muito bem o que veio fazer ali. Aos poucos, o silêncio vai virando escuta, e a escuta vai virando comunhão. Um café, uma cantoria, uma frase trocada na fila do banho. Você não percebe quando o fogo pegou — só percebe que está aceso.',
      'O acampamento termina no domingo, mas a verdade é que o acampamento não termina. O fogo volta com a gente pra dentro de casa. Volta pra dentro do trabalho. Volta pra dentro do casamento, da rua, da família. É lá que ele se prova — e é lá que se reacende, em quem precisa.',
      'Por isso a comunidade não é evento. É modo de viver. É um sim que continua sendo dito, todos os dias, mesmo quando as barracas já foram desmontadas e o ônibus já voltou. O fogo do acampamento é o fogo da pequena oração da manhã, é o fogo da paciência com o filho que faz birra, é o fogo de aceitar a própria fragilidade. É um fogo que aquece sem queimar.',
      'Se você nunca veio, talvez seja hora de pensar. Se você já veio, talvez seja hora de voltar. E se você não pode vir, ainda assim — reza com a gente. Estamos aqui, debaixo do mesmo céu, ao redor do mesmo fogo, em silêncio.',
    ],
    author: 'Padre Tiago Andrade',
    authorTitle: 'Direção espiritual da comunidade',
    publishedAt: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 12).toISOString(),
    category: 'Espiritualidade',
    readingMinutes: 6,
  },
  'cartas-de-uma-equipista': {
    title: 'Cartas de uma equipista',
    excerpt:
      'Servir não é dar de si para quem precisa. Servir é descobrir, no outro, a face de quem chamou primeiro.',
    body: [
      'Eu nunca quis ser equipista. Não porque achasse ruim — só porque não me imaginava na função. Eu vinha como campista, gostava do meu canto, achava que minha parte estava feita. Foi a coordenação que me convidou. E foi um convite difícil de recusar, porque era um convite com nome.',
      'O primeiro acampamento como equipista foi um espelho. Tudo que eu tinha vivido no outro lado, eu agora via do avesso. A vigília que parecia mágica? Tinha gente desde o meio-dia preparando. O café que sempre estava pronto? Tinha alguém acordando às cinco. A música certa na hora certa? Tinha equipe ensaiando em casa, semanas antes.',
      'Mas o que mais me marcou não foi o trabalho — foi a oração. Equipista não trabalha sozinho. Equipista reza pelo campista que vai chegar. Reza pelo nome dele, pelas dores dele, pela vida dele. E aí você entende que servir não é dar de si pra quem precisa. Servir é descobrir, no outro, a face de quem chamou primeiro.',
      'Hoje, quase oito anos depois, posso dizer que servir como equipista mudou meu trabalho, mudou meu casamento, mudou minha vida inteira. Não porque me tornei mais santa — longe disso. Mas porque aprendi a ver as pessoas de outro jeito. Cada pessoa que entra no escritório de manhã, cada vendedor no caixa do mercado, cada estranho na rua: tudo gente. Tudo nome. Tudo alma.',
      'Se você está pensando em servir, vem. A comunidade tem espaço. E se você ainda não veio nem como campista, comece por aí — mas saiba que talvez a gente acabe te chamando.',
    ],
    author: 'Mariana Coelho',
    authorTitle: 'Equipista desde 2018',
    publishedAt: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 4).toISOString(),
    category: 'Testemunhos',
    readingMinutes: 4,
  },
  'a-mesa-e-o-altar': {
    title: 'A mesa e o altar',
    excerpt:
      'Sempre que comemos juntos, a comunidade nasce de novo. Sempre que rezamos juntos, a mesa fica pronta.',
    body: [
      'Quando alguém entra pela primeira vez no acampamento, a primeira coisa que oferecemos não é uma palestra, nem um livro, nem um folheto. É um café. Não por estratégia — por costume. A comunidade aprendeu, ao longo dos anos, que nada se constrói em jejum.',
      'A mesa e o altar são o coração da comunidade. Pode parecer pleonasmo, mas não é. A mesa é onde a vida acontece — onde rimos, onde discutimos, onde nos consolamos. O altar é onde a vida é oferecida — onde rezamos, onde celebramos, onde lembramos. Os dois são feitos da mesma madeira, e os dois precisam um do outro.',
      'Sempre que comemos juntos, a comunidade nasce de novo. Sempre que rezamos juntos, a mesa fica pronta. Não há comunidade só de mesa, sem altar — vira clube. Não há comunidade só de altar, sem mesa — vira convento. A comunidade Santa Rita escolheu, há vinte anos, manter as duas portas abertas.',
      'Por isso, se você vier, vai comer com a gente. Vai partir pão, vai dividir o café, vai limpar a cozinha. E vai rezar com a gente. Vai cantar, vai se calar, vai se ajoelhar. Os dois movimentos são inseparáveis — e os dois transformam.',
    ],
    author: 'Coordenação',
    authorTitle: 'Comunidade Santa Rita',
    publishedAt: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 18).toISOString(),
    category: 'Comunidade',
    readingMinutes: 3,
  },
  'memoria-do-acampamento-xxi': {
    title: 'Memória do Acampamento XXI',
    excerpt:
      'Foi o ano em que choveu três dias seguidos. Foi também o ano em que aprendemos que casa não tem teto — tem gente.',
    body: [
      'O acampamento XXI ficará na história. Não pela programação — que foi linda, mas como sempre. Ficará pela chuva. Choveu três dias seguidos. Choveu de manhã, choveu de tarde, choveu de noite. Choveu como se o céu quisesse provar alguma coisa.',
      'Tudo que era ao ar livre virou debaixo do telhado. A vigília na fogueira virou vigília na capela. A caminhada virou roda no salão. A queima de pedidos virou meditação silenciosa. E, no entanto, ninguém foi embora. Ninguém reclamou. Ninguém pediu reembolso.',
      'Por quê? Porque a comunidade descobriu, naqueles três dias, que casa não tem teto — tem gente. Que o acampamento não é o lugar, é os irmãos. Que se Deus quiser ensinar alguma coisa, vai ensinar com sol ou com chuva, com fogueira ou com goteira.',
      'Quem viveu o XXI saiu de lá com uma certeza: a comunidade é resistente. Não porque é forte, mas porque é unida. Porque sabe rir junto da chuva. Porque sabe rezar mais alto que o trovão.',
    ],
    author: 'Lucas Pereira',
    authorTitle: 'Equipista desde 2011',
    publishedAt: new Date(new Date().getFullYear() - 1, 6, 28).toISOString(),
    category: 'Memória',
    readingMinutes: 3,
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: 'Post não encontrado' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

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
        <Container width="reading" className="relative pt-10 lg:pt-16 pb-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 eyebrow text-(color:--color-ink-faint) hover:text-(color:--color-ink) transition-colors mb-8"
          >
            <span aria-hidden>←</span> Diário
          </Link>
          <p className="eyebrow mb-4">
            {post.category} <span className="text-(color:--color-rule-strong)">·</span>{' '}
            {post.readingMinutes} min de leitura
          </p>
          <h1
            className="font-display leading-[1.02] tracking-[-0.015em] text-(color:--color-ink) text-balance"
            style={{
              fontSize: 'clamp(2rem, 5.6vw, 4.5rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            {post.title}
          </h1>
          <p
            className="mt-6 font-display italic text-[18px] lg:text-[22px] leading-[1.45] text-(color:--color-ink-soft) text-pretty max-w-xl mx-auto"
            style={{ fontVariationSettings: "'opsz' 32, 'SOFT' 90" }}
          >
            {post.excerpt}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-[12px] text-(color:--color-ink-faint)">
            <span>Por {post.author}</span>
            <span className="size-1 rounded-full bg-(color:--color-rule-strong)" />
            <span className="tabular">{formatDate(post.publishedAt)}</span>
          </div>
        </Container>

        <div className="mx-auto max-w-[640px] px-6 my-10 lg:my-12">
          <div className="ornament">
            <span className="text-(color:--color-accent-deep)">❀</span>
          </div>
        </div>
      </section>

      <article className="pb-24 lg:pb-32">
        <Container width="reading">
          <div
            className="font-display text-[18px] lg:text-[20px] leading-[1.8] text-(color:--color-ink) space-y-6"
            style={{ fontVariationSettings: "'opsz' 32, 'SOFT' 30" }}
          >
            {post.body.map((para, idx) => (
              <p key={`p-${idx}`} className={idx === 0 ? 'drop-cap text-pretty' : 'text-pretty'}>
                {para}
              </p>
            ))}
          </div>

          <div className="mt-16">
            <div className="ornament">
              <span className="text-(color:--color-accent-deep)">✦</span>
            </div>
          </div>

          <footer className="mt-16 paper-card rounded-(--radius-md) p-6 lg:p-8 flex items-center gap-5">
            <span
              className="size-14 inline-flex items-center justify-center rounded-full bg-(color:--color-oxblood-soft) text-(color:--color-oxblood) font-display italic text-2xl shrink-0"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              {post.author
                .split(' ')
                .slice(0, 2)
                .map((p) => p[0])
                .join('')
                .toUpperCase()}
            </span>
            <div>
              <p
                className="font-display text-xl tracking-tight"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
              >
                {post.author}
              </p>
              <p className="text-[13px] text-(color:--color-ink-faint) mt-0.5">
                {post.authorTitle}
              </p>
            </div>
          </footer>
        </Container>
      </article>

      <section className="py-16 border-t border-(color:--color-rule) bg-(color:--color-paper-2)/40">
        <Container width="reading" className="text-center">
          <p className="eyebrow mb-3">Continue lendo</p>
          <p
            className="font-display italic text-2xl text-(color:--color-ink-soft)"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
          >
            Há outros capítulos esperando.
          </p>
          <div className="mt-6">
            <Button href="/blog" variant="outline">
              Voltar pro diário
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
