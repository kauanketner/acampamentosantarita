import { z } from 'zod';

const optionalText = z
  .union([z.string(), z.null(), z.literal('')])
  .transform((v) => (v === '' || v == null ? null : v));

export const tribeMemberRoleSchema = z.enum(['lider', 'vice_lider', 'campista']);

const tribeBaseSchema = z
  .object({
    eventId: z.string().uuid(),
    name: z.string().min(2).max(120),
    color: optionalText.optional(),
    motto: optionalText.optional(),
    description: optionalText.optional(),
    photoUrl: z
      .union([z.string().url(), z.null(), z.literal('')])
      .transform((v) => (v === '' || v == null ? null : v))
      .optional(),
    sortOrder: z.number().int().min(0).default(0),
  })
  .strict();

export const createTribeSchema = tribeBaseSchema;

export const updateTribeSchema = tribeBaseSchema.partial().omit({ eventId: true });

export const addMemberSchema = z
  .object({
    personId: z.string().uuid(),
    role: tribeMemberRoleSchema.default('campista'),
  })
  .strict();

export type CreateTribe = z.infer<typeof createTribeSchema>;
export type UpdateTribe = z.infer<typeof updateTribeSchema>;
export type AddMember = z.infer<typeof addMemberSchema>;
