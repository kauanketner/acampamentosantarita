import { z } from 'zod';

const moneyString = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Valor inválido (use ponto, ex: 5.00)');

export const posCategorySchema = z.enum(['cantina', 'lojinha', 'outros']);

const optionalText = z
  .union([z.string(), z.null(), z.literal('')])
  .transform((v) => (v === '' || v == null ? null : v));

const itemBase = z
  .object({
    name: z.string().min(2).max(120),
    sku: optionalText.optional(),
    category: posCategorySchema.default('cantina'),
    price: moneyString,
    active: z.boolean().default(true),
    stock: z.number().int().min(0).nullable().optional(),
  })
  .strict();

export const createPosItemSchema = itemBase;
export const updatePosItemSchema = itemBase.partial();

export const openAccountSchema = z
  .object({
    personId: z.string().uuid(),
    eventId: z.string().uuid(),
  })
  .strict();

export const addTransactionSchema = z
  .object({
    posItemId: z.string().uuid().nullable().optional(),
    itemName: z.string().min(1).max(180),
    quantity: z.number().int().min(1).default(1),
    unitPrice: moneyString,
    notes: optionalText.optional(),
  })
  .strict();

export type CreatePosItem = z.infer<typeof createPosItemSchema>;
export type UpdatePosItem = z.infer<typeof updatePosItemSchema>;
export type OpenAccount = z.infer<typeof openAccountSchema>;
export type AddTransaction = z.infer<typeof addTransactionSchema>;
