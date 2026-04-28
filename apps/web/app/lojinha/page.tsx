import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import { brl } from '@/lib/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lojinha',
  description:
    'Catálogo de produtos da comunidade Santa Rita — feitos com cuidado, vendidos pelo WhatsApp.',
};

const SHOP_WHATSAPP = process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER ?? '5511000000000';

const products = [
  {
    id: 'rosario-madeira',
    name: 'Rosário de madeira',
    sub: 'Olivência · Itália',
    price: 78,
    desc: 'Rosário tradicional, madeira de oliveira da Terra Santa, corrente de bronze antigo.',
    coverGradient: 0,
  },
  {
    id: 'tercinho-pano',
    name: 'Terço em pano',
    sub: 'Costurado à mão',
    price: 24,
    desc: 'Pequeno, leve, cabe no bolso. Ideal pra ter sempre por perto.',
    coverGradient: 1,
  },
  {
    id: 'caderno-comunidade',
    name: 'Caderno da comunidade',
    sub: 'Capa em papel kraft',
    price: 38,
    desc: 'Caderno de oração e anotações. 96 páginas pautadas, com calendário litúrgico.',
    coverGradient: 2,
  },
  {
    id: 'camiseta-ed-22',
    name: 'Camiseta · Edição XXII',
    sub: 'Algodão peruano',
    price: 89,
    desc: 'Estampa exclusiva da edição. Tamanhos P, M, G, GG. Cor: cru.',
    coverGradient: 3,
  },
  {
    id: 'velas-aromaticas',
    name: 'Velas aromáticas',
    sub: 'Trio · 3 fragrâncias',
    price: 64,
    desc: 'Cera vegetal, fragrâncias suaves: rosa, mirra, lavanda. 40h de queima cada.',
    coverGradient: 4,
  },
  {
    id: 'caneca-litografia',
    name: 'Caneca litografia',
    sub: 'Edição limitada',
    price: 49,
    desc: 'Caneca de cerâmica com a logomarca da comunidade. 350ml.',
    coverGradient: 5,
  },
];

export default function LojinhaPage() {
  return (
    <>
      <section className="relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, color-mix(in oklch, var(--color-gold) 10%, transparent), transparent 50%)',
          }}
        />
        <Container width="wide" className="relative pt-12 lg:pt-20 pb-12">
          <div className="flex items-center gap-3 mb-8">
            <Logomark size={22} tone="oxblood" />
            <span className="eyebrow">Lojinha · Sustento da comunidade</span>
          </div>
          <h1
            className="font-display leading-[0.98] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            Pequenas coisas{' '}
            <span
              className="italic text-(color:--color-oxblood)"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              feitas com calma.
            </span>
          </h1>
          <p className="mt-6 text-[16px] lg:text-[17px] text-(color:--color-ink-soft) max-w-2xl leading-relaxed text-pretty">
            A lojinha sustenta os acampamentos solidários, as bolsas para quem não pode pagar, e a
            missão da comunidade. Os pedidos são feitos pelo WhatsApp — clique no item que você
            quer.
          </p>
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container width="wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20 border-t border-(color:--color-rule) bg-(color:--color-paper-2)/40">
        <Container width="reading" className="text-center">
          <p className="eyebrow mb-4">Como funciona</p>
          <p className="pull-quote text-(color:--color-ink) max-w-xl mx-auto">
            Sem checkout. Sem frio. É só clicar e conversar.
          </p>
          <p className="mt-6 text-[14px] text-(color:--color-ink-soft) max-w-md mx-auto leading-relaxed">
            Você escolhe, manda mensagem, a equipe combina o pagamento (PIX) e você retira na
            paróquia ou recebe pelo correio. Simples e direto.
          </p>
        </Container>
      </section>
    </>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const message = encodeURIComponent(
    `Oi! Tenho interesse em "${product.name}" da lojinha da comunidade. Pode me ajudar?`,
  );
  const href = `https://wa.me/${SHOP_WHATSAPP}?text=${message}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative paper-card rounded-(--radius-md) overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-[0_10px_30px_color-mix(in_oklch,_black_8%,_transparent)] transition-all duration-300"
    >
      <div
        className="relative aspect-square overflow-hidden vignette"
        style={{ background: gradientForCover(product.coverGradient) }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display italic text-(color:--color-paper)/55 text-[clamp(4rem,12vw,6.5rem)] leading-none select-none"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            aria-hidden
          >
            ❀
          </span>
        </div>
        <div className="absolute top-3 right-3 paper-card rounded-(--radius-sm) px-2.5 py-1.5 text-center">
          <p
            className="font-display tabular tracking-tight text-(color:--color-ink)"
            style={{
              fontSize: '15px',
              fontVariationSettings: "'opsz' 144, 'SOFT' 30",
            }}
          >
            {brl(product.price)}
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-5 lg:p-6">
        <p className="eyebrow mb-2">{product.sub}</p>
        <h3
          className="font-display text-xl tracking-tight text-(color:--color-ink) group-hover:text-(color:--color-oxblood) transition-colors leading-tight"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
        >
          {product.name}
        </h3>
        <p className="mt-2 text-[13px] text-(color:--color-ink-soft) leading-relaxed flex-1">
          {product.desc}
        </p>
        <p className="mt-5 pt-4 border-t border-(color:--color-rule)/60 text-[12px] text-(color:--color-oxblood) inline-flex items-center justify-between">
          <span>Pedir no WhatsApp</span>
          <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
            <path
              d="M3 9L9 3M9 3H4M9 3V8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </p>
      </div>
    </a>
  );
}

const palettes = [
  'linear-gradient(135deg, oklch(0.36 0.13 22), oklch(0.5 0.13 30))',
  'linear-gradient(135deg, oklch(0.42 0.07 130), oklch(0.55 0.09 110))',
  'linear-gradient(135deg, oklch(0.6 0.13 70), oklch(0.45 0.12 50))',
  'linear-gradient(135deg, oklch(0.3 0.1 25), oklch(0.4 0.12 35))',
  'linear-gradient(135deg, oklch(0.5 0.12 45), oklch(0.6 0.1 80))',
  'linear-gradient(135deg, oklch(0.38 0.1 15), oklch(0.48 0.13 30))',
] as const;

function gradientForCover(i: number): string {
  return palettes[i % palettes.length] ?? palettes[0];
}
