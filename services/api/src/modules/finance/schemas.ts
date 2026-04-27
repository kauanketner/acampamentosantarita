import { z } from 'zod';

export const paymentMethodSchema = z.enum([
  'pix',
  'cartao',
  'boleto',
  'dinheiro',
  'transferencia',
]);

const moneyString = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Valor inválido (use ponto, ex: 280.00)');

export const recordCashPaymentSchema = z
  .object({
    amount: moneyString,
    method: paymentMethodSchema.default('dinheiro'),
    notes: z.string().max(500).nullable().optional(),
  })
  .strict();

export type RecordCashPayment = z.infer<typeof recordCashPaymentSchema>;
