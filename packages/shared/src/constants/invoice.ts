export const INVOICE_TYPES = ['registration', 'pos', 'shop', 'other'] as const;
export type InvoiceType = (typeof INVOICE_TYPES)[number];

export const INVOICE_STATUSES = [
  'pendente',
  'pago',
  'parcial',
  'vencido',
  'cancelado',
  'reembolsado',
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
