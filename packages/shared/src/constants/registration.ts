export const REGISTRATION_STATUSES = [
  'pendente',
  'aprovada',
  'rejeitada',
  'em_espera',
  'confirmada',
  'cancelada',
] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const REGISTRATION_PAYMENT_STATUSES = [
  'isento',
  'pendente',
  'pago',
  'parcial',
  'reembolsado',
] as const;
export type RegistrationPaymentStatus = (typeof REGISTRATION_PAYMENT_STATUSES)[number];
