// Formata telefone (raw digits) para exibição: "+55 (11) 99999-0000"
export function maskPhoneDisplay(phoneRaw: string): string {
  const digits = phoneRaw.replace(/\D/g, '');
  if (digits.length === 0) return '';
  const local = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  if (local.length === 11) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return phoneRaw;
}

// Formata número para BRL: 280 → "R$ 280,00"
export function brl(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return 'R$ —';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const MONTHS_SHORT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

// Aceita "yyyy-MM-dd" (date column) sem fuso, e ISO completos.
function parseDate(iso: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y!, m! - 1, d!);
  }
  return new Date(iso);
}

export function formatDate(iso: string, opts: { year?: boolean } = {}): string {
  const d = parseDate(iso);
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  return opts.year ? `${day} de ${month} de ${d.getFullYear()}` : `${day} de ${month}`;
}

// "23 — 26 de julho · 2026" (mesmo mês), "30 de jul — 2 de ago · 2026" (mês diferente)
export function formatDateRange(startIso: string, endIso: string): string {
  const start = parseDate(startIso);
  const end = parseDate(endIso);
  const sameMonth =
    start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  const sameDay =
    sameMonth && start.getDate() === end.getDate();
  const year = end.getFullYear();
  if (sameDay) {
    return `${start.getDate()} de ${MONTHS[start.getMonth()]} · ${year}`;
  }
  if (sameMonth) {
    return `${start.getDate()} — ${end.getDate()} de ${MONTHS[start.getMonth()]} · ${year}`;
  }
  const sStr = `${start.getDate()} de ${MONTHS_SHORT[start.getMonth()]}`;
  const eStr = `${end.getDate()} de ${MONTHS_SHORT[end.getMonth()]}`;
  return `${sStr} — ${eStr} · ${year}`;
}

// Cor de cover determinística baseada no id ou slug do evento.
// Pega um par de gradiente fixo do palette, escolhido pelo hash do input.
const GRADIENTS: Array<[string, string]> = [
  ['#3D5A40', '#1F2D20'], // verde mata
  ['#7A5A2E', '#3D2C17'], // âmbar profundo
  ['#3F4A66', '#1F2433'], // azul liturgia
  ['#6B3F4A', '#33222A'], // bordô
  ['#5B5042', '#2C271F'], // areia escura
  ['#3E5664', '#1F2B33'], // cinza azulado
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function eventGradient(idOrSlug: string): [string, string] {
  return GRADIENTS[hashString(idOrSlug) % GRADIENTS.length]!;
}
