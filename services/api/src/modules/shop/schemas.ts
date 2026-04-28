import { z } from 'zod';

const moneyString = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Valor inválido (use ponto, ex: 49.90)');

const optionalText = z
  .union([z.string(), z.null(), z.literal('')])
  .transform((v) => (v === '' || v == null ? null : v));

const photo = z.object({
  url: z.string().url(),
  alt: z.string().nullable().optional(),
});

const productBase = z
  .object({
    name: z.string().min(2).max(180),
    description: optionalText.optional(),
    price: moneyString,
    photos: z.array(photo).default([]),
    category: optionalText.optional(),
    active: z.boolean().default(true),
    sortOrder: z.number().int().min(0).default(0),
    whatsappMessageTemplate: optionalText.optional(),
  })
  .strict();

export const createShopProductSchema = productBase;
export const updateShopProductSchema = productBase.partial();

export type CreateShopProduct = z.infer<typeof createShopProductSchema>;
export type UpdateShopProduct = z.infer<typeof updateShopProductSchema>;
