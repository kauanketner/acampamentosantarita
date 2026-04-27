import { z } from 'zod';

const phoneRaw = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .pipe(z.string().min(10).max(13));

const cpfRaw = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .pipe(z.string().length(11));

const cepRaw = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .pipe(z.string().length(8));

const nullableTrim = (s: string | null | undefined) =>
  s == null ? null : s.trim() === '' ? null : s.trim();

export const personUpdateSchema = z
  .object({
    fullName: z.string().min(2).optional(),
    gender: z.enum(['masculino', 'feminino']).nullable().optional(),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (yyyy-mm-dd)')
      .nullable()
      .optional(),
    cpf: cpfRaw.nullable().optional(),
    maritalStatus: z
      .enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel'])
      .nullable()
      .optional(),
    heightCm: z.number().int().min(50).max(250).nullable().optional(),
    weightKg: z.number().positive().max(400).nullable().optional(),
    shirtSize: z.enum(['PP', 'P', 'M', 'G', 'GG', 'XGG']).nullable().optional(),
    mobilePhone: phoneRaw.optional(),
    zipCode: cepRaw.nullable().optional(),
    street: z.string().nullable().optional().transform(nullableTrim),
    neighborhood: z.string().nullable().optional().transform(nullableTrim),
    city: z.string().nullable().optional().transform(nullableTrim),
    state: z.string().length(2).nullable().optional(),
    addressNumber: z.string().nullable().optional().transform(nullableTrim),
    addressComplement: z.string().nullable().optional().transform(nullableTrim),
    emergencyContacts: z
      .array(
        z.object({
          name: z.string().min(2),
          relationship: z.string().min(1),
          phone: phoneRaw,
        }),
      )
      .min(2)
      .max(3)
      .optional(),
  })
  .strict();

export type PersonUpdate = z.infer<typeof personUpdateSchema>;
