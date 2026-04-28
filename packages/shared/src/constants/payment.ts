export const PAYMENT_METHODS = ['pix', 'cartao', 'boleto', 'dinheiro', 'transferencia'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
