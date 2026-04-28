import { z } from 'zod';

const optionalText = z
  .union([z.string(), z.null(), z.literal('')])
  .transform((v) => (v === '' || v == null ? null : v));

const teamBase = z
  .object({
    name: z.string().min(2).max(120),
    description: optionalText.optional(),
    color: optionalText.optional(),
    icon: optionalText.optional(),
  })
  .strict();

export const createServiceTeamSchema = teamBase;
export const updateServiceTeamSchema = teamBase.partial();

export const addAssignmentSchema = z
  .object({
    eventId: z.string().uuid(),
    personId: z.string().uuid(),
    functionRole: z.string().min(1).max(60).default('membro'),
    confirmed: z.boolean().default(false),
  })
  .strict();

export type CreateServiceTeam = z.infer<typeof createServiceTeamSchema>;
export type UpdateServiceTeam = z.infer<typeof updateServiceTeamSchema>;
export type AddAssignment = z.infer<typeof addAssignmentSchema>;
