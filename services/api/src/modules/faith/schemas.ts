import { z } from 'zod';

export const sacramentSchema = z.enum([
  'batismo',
  'eucaristia',
  'crisma',
  'matrimonio',
  'ordem',
  'uncao_enfermos',
  'confissao',
]);

export const faithUpsertSchema = z
  .object({
    religion: z.string().nullable().optional(),
    parish: z.string().nullable().optional(),
    groupName: z.string().nullable().optional(),
    sacraments: z.array(sacramentSchema).default([]),
  })
  .strict();

export type FaithUpsert = z.infer<typeof faithUpsertSchema>;
export type Sacrament = z.infer<typeof sacramentSchema>;
