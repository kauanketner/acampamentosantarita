import { z } from 'zod';

export const createRegistrationSchema = z
  .object({
    eventId: z.string().uuid(),
    roleIntent: z.enum(['campista', 'equipista']),
    serviceTeamId: z.string().uuid().optional(),
    customAnswers: z
      .array(
        z.object({
          customQuestionId: z.string().uuid(),
          answer: z.unknown(),
        }),
      )
      .default([]),
  })
  .strict();

export const cancelRegistrationSchema = z
  .object({
    reason: z.string().min(1).max(500).optional(),
  })
  .strict();

export const adminCancelRegistrationSchema = z
  .object({
    reason: z.string().min(1).max(500).optional(),
  })
  .strict();

export const rejectRegistrationSchema = z
  .object({
    reason: z.string().min(1).max(500).optional(),
  })
  .strict();

export type CreateRegistration = z.infer<typeof createRegistrationSchema>;
export type CancelRegistration = z.infer<typeof cancelRegistrationSchema>;
export type AdminCancelRegistration = z.infer<typeof adminCancelRegistrationSchema>;
export type RejectRegistration = z.infer<typeof rejectRegistrationSchema>;
