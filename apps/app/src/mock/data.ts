// Mock data — usado enquanto a API ainda não está implementada.
// Quando os endpoints reais estiverem prontos, troque por chamadas via lib/api.

export type Person = {
  id: string;
  fullName: string;
  firstName: string;
  city: string;
  state: string;
  avatarUrl: string | null;
  campCount: number;
  isVeteran: boolean;
  shirtSize: string;
};

export type EventStatus =
  | 'inscricoes_abertas'
  | 'inscricoes_fechadas'
  | 'em_andamento'
  | 'finalizado';

export type AppEvent = {
  id: string;
  slug: string;
  type: 'acampamento' | 'retiro' | 'encontro' | 'formacao';
  name: string;
  editionNumber?: number;
  startDate: string;
  endDate: string;
  location: string;
  shortDescription: string;
  longDescription: string;
  coverGradient: [string, string];
  status: EventStatus;
  priceCampista?: number;
  priceEquipista?: number;
  registrationDeadline?: string;
  allowFirstTimer: boolean;
  spotsLeft?: number;
};

export type Registration = {
  id: string;
  eventId: string;
  eventName: string;
  eventDates: string;
  role: 'campista' | 'equipista';
  status: 'pendente' | 'aprovada' | 'confirmada' | 'cancelada' | 'em_espera';
  paymentStatus: 'isento' | 'pendente' | 'pago' | 'parcial';
  amount: number;
  registeredAt: string;
};

export type Invoice = {
  id: string;
  reference: string;
  description: string;
  amount: number;
  paid: number;
  status: 'pendente' | 'pago' | 'parcial' | 'vencido';
  dueDate: string;
  type: 'registration' | 'pos' | 'shop' | 'other';
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  read: boolean;
  audience: 'todos' | 'equipistas' | 'evento' | 'tribo';
  eventName?: string;
};

export type GalleryAlbum = {
  id: string;
  slug: string;
  name: string;
  year: number;
  photos: number;
  cover: string;
};

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export type CampParticipation = {
  id: string;
  edition: number;
  year: number;
  role: 'campista' | 'equipista' | 'lider';
  tribeName?: string;
  serviceTeam?: string;
  functionRole?: string;
  isLegacy: boolean;
};

export type PosTransaction = {
  id: string;
  itemName: string;
  quantity: number;
  total: number;
  recordedAt: string;
};

// ---------- DATA ----------

export const me: Person = {
  id: 'p_001',
  fullName: 'Mariana Lopes Almeida',
  firstName: 'Mariana',
  city: 'Belo Horizonte',
  state: 'MG',
  avatarUrl: null,
  campCount: 4,
  isVeteran: true,
  shirtSize: 'M',
};

const gradients: AppEvent['coverGradient'][] = [
  ['oklch(0.32 0.075 28)', 'oklch(0.55 0.085 50)'],
  ['oklch(0.42 0.09 45)', 'oklch(0.78 0.075 65)'],
  ['oklch(0.28 0.06 55)', 'oklch(0.48 0.07 35)'],
  ['oklch(0.32 0.045 80)', 'oklch(0.62 0.075 70)'],
];

export const events: AppEvent[] = [
  {
    id: 'evt_14',
    slug: '14-acampamento',
    type: 'acampamento',
    name: '14º Acampamento Santa Rita',
    editionNumber: 14,
    startDate: '2026-07-23',
    endDate: '2026-07-26',
    location: 'Sítio das Acácias · Brumadinho, MG',
    shortDescription: 'Quatro dias. Um chamado.',
    longDescription:
      'O 14º acampamento da nossa comunidade. Para quem ouve o convite pela primeira vez e para quem volta a servir. Os detalhes do que se vive lá dentro continuam sendo segredo de quem aceita.',
    coverGradient: gradients[0]!,
    status: 'inscricoes_abertas',
    priceCampista: 480,
    priceEquipista: 280,
    registrationDeadline: '2026-06-10',
    allowFirstTimer: true,
    spotsLeft: 12,
  },
  {
    id: 'evt_retiro_avent',
    slug: 'retiro-de-advento-2026',
    type: 'retiro',
    name: 'Retiro de Advento',
    startDate: '2026-12-05',
    endDate: '2026-12-07',
    location: 'Casa de Oração Bom Pastor · Nova Lima, MG',
    shortDescription: 'Três dias para preparar o coração.',
    longDescription:
      'Um retiro silencioso para quem quer entrar no Advento devagar. Aberto à comunidade veterana.',
    coverGradient: gradients[1]!,
    status: 'inscricoes_abertas',
    priceCampista: 220,
    priceEquipista: 140,
    registrationDeadline: '2026-11-20',
    allowFirstTimer: false,
    spotsLeft: 28,
  },
  {
    id: 'evt_form_lideres',
    slug: 'formacao-de-lideres-2026',
    type: 'formacao',
    name: 'Formação de Líderes',
    startDate: '2026-05-09',
    endDate: '2026-05-10',
    location: 'Paróquia Santa Rita · BH, MG',
    shortDescription: 'Para quem servirá no 14º.',
    longDescription:
      'Formação obrigatória para coordenadores e líderes que servirão no próximo acampamento.',
    coverGradient: gradients[2]!,
    status: 'inscricoes_fechadas',
    priceCampista: 0,
    priceEquipista: 0,
    allowFirstTimer: false,
  },
  {
    id: 'evt_13',
    slug: '13-acampamento',
    type: 'acampamento',
    name: '13º Acampamento Santa Rita',
    editionNumber: 13,
    startDate: '2025-07-24',
    endDate: '2025-07-27',
    location: 'Sítio das Acácias · Brumadinho, MG',
    shortDescription: 'Reverberações.',
    longDescription: '',
    coverGradient: gradients[3]!,
    status: 'finalizado',
    allowFirstTimer: true,
  },
];

export const registrations: Registration[] = [
  {
    id: 'reg_001',
    eventId: 'evt_14',
    eventName: '14º Acampamento Santa Rita',
    eventDates: '23 — 26 de julho · 2026',
    role: 'equipista',
    status: 'aprovada',
    paymentStatus: 'parcial',
    amount: 280,
    registeredAt: '2026-04-12',
  },
  {
    id: 'reg_002',
    eventId: 'evt_retiro_avent',
    eventName: 'Retiro de Advento',
    eventDates: '5 — 7 de dezembro · 2026',
    role: 'campista',
    status: 'pendente',
    paymentStatus: 'pendente',
    amount: 220,
    registeredAt: '2026-04-22',
  },
  {
    id: 'reg_003',
    eventId: 'evt_13',
    eventName: '13º Acampamento Santa Rita',
    eventDates: '24 — 27 de julho · 2025',
    role: 'equipista',
    status: 'confirmada',
    paymentStatus: 'pago',
    amount: 260,
    registeredAt: '2025-05-03',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'inv_001',
    reference: 'SR-2026-001',
    description: '14º Acampamento — equipe',
    amount: 280,
    paid: 140,
    status: 'parcial',
    dueDate: '2026-06-10',
    type: 'registration',
  },
  {
    id: 'inv_002',
    reference: 'SR-2026-002',
    description: 'Retiro de Advento',
    amount: 220,
    paid: 0,
    status: 'pendente',
    dueDate: '2026-11-20',
    type: 'registration',
  },
  {
    id: 'inv_2025',
    reference: 'SR-2025-118',
    description: '13º Acampamento — equipe',
    amount: 260,
    paid: 260,
    status: 'pago',
    dueDate: '2025-06-30',
    type: 'registration',
  },
];

export const announcements: Announcement[] = [
  {
    id: 'an_001',
    title: 'Reunião de equipe nesta sexta',
    body: 'Pessoal, reunião amanhã às 20h na paróquia. Quem coordena precisa estar presente; demais equipistas estão convidados. Trazer caderno.',
    publishedAt: '2026-04-25T18:30:00Z',
    read: false,
    audience: 'equipistas',
    eventName: '14º Acampamento',
  },
  {
    id: 'an_002',
    title: '14º Santa Rita — inscrições abertas',
    body: 'As inscrições para o 14º Acampamento estão abertas até 10 de junho. Vagas limitadas; campistas pela primeira vez têm prioridade até o dia 15 de maio.',
    publishedAt: '2026-04-12T12:00:00Z',
    read: false,
    audience: 'todos',
  },
  {
    id: 'an_003',
    title: 'Lojinha — novas peças',
    body: 'Chegaram camisetas e canecas novas no catálogo. Tudo feito à mão pelo grupo de mídia.',
    publishedAt: '2026-04-08T14:00:00Z',
    read: true,
    audience: 'todos',
  },
  {
    id: 'an_004',
    title: 'Galeria do 13º atualizada',
    body: 'Subimos mais 230 fotos no álbum do 13º acampamento. Aproveitem.',
    publishedAt: '2026-03-30T09:00:00Z',
    read: true,
    audience: 'todos',
  },
];

export const galleryAlbums: GalleryAlbum[] = [
  {
    id: 'g13',
    slug: '13-acampamento',
    name: '13º Acampamento',
    year: 2025,
    photos: 487,
    cover: 'linear-gradient(135deg, oklch(0.42 0.09 45), oklch(0.62 0.085 70))',
  },
  {
    id: 'g_retiro_24',
    slug: 'retiro-quaresma-2025',
    name: 'Retiro de Quaresma',
    year: 2025,
    photos: 92,
    cover: 'linear-gradient(135deg, oklch(0.32 0.06 35), oklch(0.55 0.07 50))',
  },
  {
    id: 'g_pascoa_24',
    slug: 'pascoa-juvenil-2024',
    name: 'Páscoa Juvenil',
    year: 2024,
    photos: 156,
    cover: 'linear-gradient(135deg, oklch(0.38 0.075 28), oklch(0.6 0.085 60))',
  },
  {
    id: 'g12',
    slug: '12-acampamento',
    name: '12º Acampamento',
    year: 2024,
    photos: 412,
    cover: 'linear-gradient(135deg, oklch(0.4 0.085 80), oklch(0.66 0.075 50))',
  },
];

export const faq: FaqItem[] = [
  {
    id: 'f1',
    category: 'Inscrições',
    question: 'Como funciona o cadastro pela primeira vez?',
    answer:
      'Você cria sua conta e preenche os 5 passos do cadastro: dados pessoais, endereço, contatos de emergência, vida de fé e saúde. Depois disso pode se inscrever em qualquer evento aberto.',
  },
  {
    id: 'f2',
    category: 'Inscrições',
    question: 'Sou veterano. Preciso preencher meu histórico?',
    answer:
      'Sim. No fluxo de cadastro veterano há um passo a mais para você declarar de quais acampamentos passados participou, em qual papel (campista, equipista ou líder) e em qual tribo ou equipe. Isso preserva a história da comunidade.',
  },
  {
    id: 'f3',
    category: 'Inscrições',
    question: 'Posso cancelar minha inscrição?',
    answer:
      'Sim, até 15 dias antes do início do evento. Pagamentos já realizados são reembolsados conforme a política do evento.',
  },
  {
    id: 'f4',
    category: 'Pagamento',
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'PIX, cartão de crédito (em até 6x) e boleto, todos via Asaas. Pagamentos em dinheiro são registrados manualmente pela equipe quando necessário.',
  },
  {
    id: 'f5',
    category: 'Pagamento',
    question: 'Posso pagar parcelado?',
    answer:
      'Sim, em até 6 vezes no cartão. Para PIX e boleto, é possível combinar pagamentos parciais com a tesouraria.',
  },
  {
    id: 'f6',
    category: 'Saúde',
    question: 'Por que vocês pedem tantos dados de saúde?',
    answer:
      'Para que possamos cuidar bem de você. As 19 perguntas cobrem alergias, restrições alimentares, medicações e particularidades importantes. Tudo é confidencial e revisado a cada nova inscrição.',
  },
  {
    id: 'f7',
    category: 'Sobre o acampamento',
    question: 'Como descubro minha tribo?',
    answer:
      'A tribo é uma surpresa. Você só descobre ao final do evento. Faz parte da experiência.',
  },
];

export const myParticipations: CampParticipation[] = [
  {
    id: 'cp_13_eq',
    edition: 13,
    year: 2025,
    role: 'equipista',
    serviceTeam: 'Bem-Estar',
    functionRole: 'membro',
    isLegacy: false,
  },
  {
    id: 'cp_12_eq',
    edition: 12,
    year: 2024,
    role: 'equipista',
    serviceTeam: 'Cozinha',
    functionRole: 'vice-coordenadora',
    isLegacy: true,
  },
  {
    id: 'cp_11_camp',
    edition: 11,
    year: 2023,
    role: 'campista',
    tribeName: 'Tribo do Cedro',
    isLegacy: true,
  },
  {
    id: 'cp_10_camp',
    edition: 10,
    year: 2022,
    role: 'campista',
    tribeName: 'Tribo do Cedro',
    isLegacy: true,
  },
];

export const posTransactions: PosTransaction[] = [
  { id: 't1', itemName: 'Caneca personalizada', quantity: 1, total: 35, recordedAt: 'sex 26, 09:14' },
  { id: 't2', itemName: 'Café', quantity: 2, total: 8, recordedAt: 'sex 26, 09:14' },
  { id: 't3', itemName: 'Camiseta — Tribo do Cedro', quantity: 1, total: 65, recordedAt: 'qui 25, 21:42' },
  { id: 't4', itemName: 'Suco natural', quantity: 1, total: 6, recordedAt: 'qui 25, 16:08' },
];

export const myTribe = {
  name: 'Tribo do Cedro',
  motto: 'Aquele que permanece.',
  color: 'oklch(0.42 0.075 60)',
  isRevealed: false,
  members: [
    { id: 'm1', name: 'Pedro Henrique Souza', role: 'lider' as const },
    { id: 'm2', name: 'Aline Mendes', role: 'vice_lider' as const },
    { id: 'm3', name: 'Mariana Lopes Almeida', role: 'campista' as const },
    { id: 'm4', name: 'Carlos Eduardo Pinto', role: 'campista' as const },
    { id: 'm5', name: 'Júlia Ribeiro', role: 'campista' as const },
  ],
};

export function brl(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString('pt-BR', opts ?? { day: '2-digit', month: 'short' });
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth();
  if (sameMonth) {
    return `${s.getDate()} — ${e.getDate()} de ${s.toLocaleDateString('pt-BR', { month: 'long' })} · ${s.getFullYear()}`;
  }
  return `${s.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} — ${e.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} · ${s.getFullYear()}`;
}
