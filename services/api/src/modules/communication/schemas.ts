import { z } from 'zod';

export const announcementAudienceSchema = z.enum([
  'todos',
  'participantes_evento',
  'equipistas',
  'tribo_x',
  'equipe_x',
]);

const _optionalText = z
  .union([z.string(), z.null(), z.literal('')])
  .transform((v) => (v === '' || v == null ? null : v));

const announcementBaseSchema = z
  .object({
    eventId: z.string().uuid().nullable().optional(),
    title: z.string().min(2).max(180),
    body: z.string().min(2).max(5000),
    imageUrl: z
      .union([z.string().url(), z.null(), z.literal('')])
      .transform((v) => (v === '' || v == null ? null : v))
      .optional(),
    targetAudience: announcementAudienceSchema.default('todos'),
    targetId: z.string().uuid().nullable().optional(),
    sendPush: z.boolean().default(false),
    publish: z.boolean().default(false),
  })
  .strict();

export const createAnnouncementSchema = announcementBaseSchema.superRefine((val, ctx) => {
  if (
    (val.targetAudience === 'tribo_x' ||
      val.targetAudience === 'equipe_x' ||
      val.targetAudience === 'participantes_evento') &&
    !val.targetId &&
    !val.eventId
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Audiência específica exige eventId ou targetId',
      path: ['targetId'],
    });
  }
});

export const updateAnnouncementSchema = announcementBaseSchema.partial();

export type CreateAnnouncement = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncement = z.infer<typeof updateAnnouncementSchema>;
