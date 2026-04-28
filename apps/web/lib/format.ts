/**
 * Utilitários de formatação do site público.
 */

const monthsShort = [
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

const monthsLong = [
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

export function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start) return '—';
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  if (!e || s.toDateString() === e.toDateString()) {
    return `${s.getDate()} de ${monthsLong[s.getMonth()]} de ${s.getFullYear()}`;
  }
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.getDate()} de ${monthsLong[s.getMonth()]} de ${s.getFullYear()}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} de ${monthsShort[s.getMonth()]} – ${e.getDate()} de ${monthsShort[e.getMonth()]} de ${s.getFullYear()}`;
  }
  return `${s.getDate()} de ${monthsShort[s.getMonth()]} ${s.getFullYear()} – ${e.getDate()} de ${monthsShort[e.getMonth()]} ${e.getFullYear()}`;
}

export function formatDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${date.getDate()} de ${monthsLong[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatDateShort(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${date.getDate().toString().padStart(2, '0')} ${monthsShort[date.getMonth()]} ${date.getFullYear()}`;
}

export function brl(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

/**
 * Romanos (1 → I, 4 → IV, ..., até 39).
 * Usado em números de capítulo/edição.
 */
export function toRoman(n: number): string {
  const map: Array<[number, string]> = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let out = '';
  let num = n;
  for (const [val, sym] of map) {
    while (num >= val) {
      out += sym;
      num -= val;
    }
  }
  return out;
}
