import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logomark } from '@/components/ui/Logo';
import { fetchPublicSafe } from '@/lib/api';
import type { PublicFaqItem } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas frequentes',
  description:
    'Tudo o que costumam perguntar sobre os acampamentos, retiros, inscrições e a comunidade Santa Rita.',
};

export const dynamic = 'force-dynamic';

// Conteúdo seed: usado quando a API ainda não tem entradas suficientes.
const seedFaq: PublicFaqItem[] = [
  {
    id: 'seed-1',
    question: 'Quem pode participar dos acampamentos?',
    answer:
      'A maioria dos eventos é aberta a partir de 18 anos. Cada acampamento tem uma faixa etária e um perfil — campistas iniciantes, casais, equipistas, jovens. Confira no app a indicação de cada evento, ou fale com a coordenação se tiver dúvida.',
    category: 'Inscrições',
    sortOrder: 1,
  },
  {
    id: 'seed-2',
    question: 'Como faço minha inscrição?',
    answer:
      'Toda inscrição é feita pelo aplicativo da comunidade — app.acampamentosantarita.com.br. Você se cadastra, preenche sua ficha uma vez só e usa em todos os eventos. A coordenação revisa e aprova manualmente, com calma.',
    category: 'Inscrições',
    sortOrder: 2,
  },
  {
    id: 'seed-3',
    question: 'Existe alguma forma de pagar parcelado?',
    answer:
      'Sim. O app oferece PIX, cartão (com parcelamento) e boleto. Em casos especiais — bolsas, dificuldade financeira — fale diretamente com a tesouraria. Ninguém deixa de vir por causa do valor.',
    category: 'Financeiro',
    sortOrder: 3,
  },
  {
    id: 'seed-4',
    question: 'Posso cancelar minha inscrição?',
    answer:
      'Pode. Cancelamentos até 30 dias antes do evento têm 90% de reembolso; até 15 dias, 50%; depois disso, o valor fica como crédito pra um próximo evento. Se houver impedimento de saúde, a coordenação avalia caso a caso.',
    category: 'Financeiro',
    sortOrder: 4,
  },
  {
    id: 'seed-5',
    question: 'O que eu preciso levar?',
    answer:
      'Roupa de cama, toalha, itens de higiene, lanterna, repelente, agasalho e disposição. Cada acampamento tem uma lista específica que vai pro seu app uma semana antes — não se preocupa em decorar agora.\n\nNão precisa levar Bíblia (a comunidade fornece). Não precisa levar comida (servimos todas as refeições). E não precisa levar conhecimento prévio — só vontade.',
    category: 'Logística',
    sortOrder: 5,
  },
  {
    id: 'seed-6',
    question: 'Onde acontecem os acampamentos?',
    answer:
      'Em sítios de retiro próximos a São Paulo. O local muda dependendo do evento — você descobre na inscrição. Há transporte saindo da paróquia, quando aplicável.',
    category: 'Logística',
    sortOrder: 6,
  },
  {
    id: 'seed-7',
    question: 'O que é um equipista?',
    answer:
      'Equipista é quem serve no acampamento — cozinha, organização, oração, cantoria, recepção. Servir como equipista é um passo natural pra quem já viveu o acampamento como campista. Tem formação própria, encontros mensais e um compromisso especial com a comunidade.',
    category: 'Comunidade',
    sortOrder: 7,
  },
  {
    id: 'seed-8',
    question: 'Não sou da Igreja Católica. Posso participar?',
    answer:
      'Pode. A comunidade tem raiz católica, e os acampamentos têm celebrações eucarísticas — mas você é bem-vindo independente do seu caminho de fé. Muita gente que veio buscando algo, sem saber bem o quê, encontrou aqui um lugar.',
    category: 'Comunidade',
    sortOrder: 8,
  },
];

export default async function FaqPage() {
  const data = await fetchPublicSafe<{ items: PublicFaqItem[] }>(
    '/faq',
    { items: [] },
    { revalidate: 600 },
  );
  const items = (data.items ?? []).length > 0 ? data.items : seedFaq;

  // Group por categoria
  const grouped = items.reduce<Record<string, PublicFaqItem[]>>((acc, item) => {
    const cat = item.category ?? 'Geral';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

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
            <span className="eyebrow">Perguntas frequentes</span>
          </div>
          <h1
            className="font-display leading-[0.98] tracking-[-0.02em] text-(color:--color-ink) text-balance max-w-4xl"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            }}
          >
            O que normalmente{' '}
            <span
              className="italic text-(color:--color-oxblood)"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              perguntam.
            </span>
          </h1>
          <p className="mt-6 text-[16px] lg:text-[17px] text-(color:--color-ink-soft) max-w-2xl leading-relaxed text-pretty">
            Reunimos aqui as dúvidas mais comuns. Se a sua não está, é só{' '}
            <a href="/contato" className="text-(color:--color-oxblood) underline-thin">
              escrever pra gente
            </a>
            .
          </p>
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container width="editorial">
          <div className="space-y-16 lg:space-y-20">
            {Object.entries(grouped).map(([category, list]) => (
              <div key={category}>
                <header className="flex items-baseline gap-4 mb-8">
                  <span
                    className="font-display italic text-(color:--color-oxblood) leading-none tabular"
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontVariationSettings: "'opsz' 144, 'SOFT' 70",
                    }}
                  >
                    {category}
                  </span>
                  <span className="flex-1 h-px bg-(color:--color-rule)" />
                  <span className="eyebrow">
                    {list.length} {list.length === 1 ? 'pergunta' : 'perguntas'}
                  </span>
                </header>
                <Accordion items={list} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20 border-t border-(color:--color-rule) bg-(color:--color-paper-2)/40">
        <Container width="reading" className="text-center">
          <p className="eyebrow mb-4">Não achou resposta?</p>
          <p className="pull-quote text-(color:--color-ink) max-w-xl mx-auto">
            A coordenação responde com calma, no WhatsApp ou por e-mail.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/contato">Escrever pra coordenação</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
