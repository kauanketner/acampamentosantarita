import { z } from 'zod';

export const eventTypeSchema = z.enum(['acampamento', 'retiro', 'encontro', 'formacao', 'outro']);

export const eventStatusSchema = z.enum([
  'rascunho',
  'inscricoes_abertas',
  'inscricoes_fechadas',
  'em_andamento',
  'finalizado',
  'cancelado',
]);

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (yyyy-mm-dd)');

const isoDateTime = z.string().datetime({ offset: true, message: 'Data/hora inválida (ISO 8601)' });

const moneyString = z.string().regex(/^\d+(\.\d{1,2})?$/, 'Valor inválido (use ponto, ex: 280.00)');

const moneyNullable = z
  .union([moneyString, z.literal(''), z.null()])
  .transform((v) => (v === '' ? null : v));

const optionalText = (max?: number) =>
  z
    .union([max ? z.string().max(max) : z.string(), z.null(), z.literal('')])
    .transform((v) => (v === '' || v == null ? null : v));

const eventBaseSchema = z
  .object({
    name: z.string().min(2).max(180),
    slug: z.string().regex(slugRegex, 'Slug inválido (ex: 14-acampamento)').max(180),
    type: eventTypeSchema,
    editionNumber: z.number().int().min(1).max(999).nullable().optional(),
    startDate: dateOnly,
    endDate: dateOnly,
    location: optionalText(180),
    description: optionalText(),
    coverImageUrl: z
      .union([z.string().url(), z.null(), z.literal('')])
      .transform((v) => (v === '' || v == null ? null : v)),
    status: eventStatusSchema.default('rascunho'),
    maxParticipants: z.number().int().min(1).max(10000).nullable().optional(),
    allowFirstTimer: z.boolean().default(false),
    isPaid: z.boolean().default(true),
    priceCampista: moneyNullable.optional(),
    priceEquipista: moneyNullable.optional(),
    registrationDeadline: z
      .union([isoDateTime, z.null(), z.literal('')])
      .transform((v) => (v === '' || v == null ? null : v))
      .optional(),
    allowRegistrationViaApp: z.boolean().default(true),
    allowRegistrationViaSite: z.boolean().default(false),
    requiresAdminApproval: z.boolean().default(true),
  })
  .strict();

export const createEventSchema = eventBaseSchema.superRefine((val, ctx) => {
  if (val.endDate < val.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'endDate deve ser >= startDate',
      path: ['endDate'],
    });
  }
  if (val.type === 'acampamento' && !val.editionNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Acampamentos exigem editionNumber',
      path: ['editionNumber'],
    });
  }
  if (val.allowFirstTimer && val.type !== 'acampamento') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Apenas acampamentos podem aceitar primeira vez',
      path: ['allowFirstTimer'],
    });
  }
});

export const updateEventSchema = eventBaseSchema.partial().superRefine((val, ctx) => {
  if (val.startDate && val.endDate && val.endDate < val.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'endDate deve ser >= startDate',
      path: ['endDate'],
    });
  }
});

export const customQuestionTypeSchema = z.enum([
  'text',
  'textarea',
  'select',
  'multi_select',
  'bool',
  'number',
  'date',
]);

export const customQuestionAudienceSchema = z.enum(['campista', 'equipista', 'ambos']);

const optionItem = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const customQuestionBaseSchema = z
  .object({
    question: z.string().min(2).max(500),
    type: customQuestionTypeSchema,
    options: z
      .object({ options: z.array(optionItem).min(1) })
      .nullable()
      .optional(),
    required: z.boolean().default(false),
    order: z.number().int().min(0).default(0),
    appliesTo: customQuestionAudienceSchema.default('ambos'),
  })
  .strict();

export const createCustomQuestionSchema = customQuestionBaseSchema.superRefine((val, ctx) => {
  if (val.type === 'select' || val.type === 'multi_select') {
    if (!val.options || val.options.options.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Perguntas do tipo select exigem options',
        path: ['options'],
      });
    }
  }
});

export const updateCustomQuestionSchema = customQuestionBaseSchema.partial();

export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type CreateCustomQuestion = z.infer<typeof createCustomQuestionSchema>;
export type UpdateCustomQuestion = z.infer<typeof updateCustomQuestionSchema>;
