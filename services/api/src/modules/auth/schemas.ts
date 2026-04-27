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
  .pipe(z.string().length(8))
  .optional();

export const personPayloadSchema = z.object({
  fullName: z.string().min(2),
  gender: z.enum(['masculino', 'feminino']).optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (yyyy-mm-dd)')
    .optional(),
  cpf: cpfRaw.optional(),
  maritalStatus: z
    .enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel'])
    .optional(),
  heightCm: z.number().int().min(50).max(250).optional(),
  weightKg: z.number().positive().max(400).optional(),
  shirtSize: z.enum(['PP', 'P', 'M', 'G', 'GG', 'XGG']).optional(),
  mobilePhone: phoneRaw,
  zipCode: cepRaw,
  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(2),
  relationship: z.string().min(1),
  phone: phoneRaw,
});

export const healthPayloadSchema = z
  .object({
    hasChronicDisease: z.boolean(),
    chronicDiseaseDetail: z.string().optional(),
    hadSurgery: z.boolean(),
    surgeryDetail: z.string().optional(),
    hasSenseDisability: z.boolean(),
    senseDisabilityDetail: z.string().optional(),
    hasDisability: z.boolean(),
    disabilityType: z.enum(['fisica', 'visual', 'auditiva', 'intelectual']).optional(),
    hasAllergy: z.boolean(),
    allergyDetail: z.string().optional(),
    hasAsthma: z.boolean(),
    usesInhaler: z.boolean(),
    hasDiabetes: z.boolean(),
    insulinDependent: z.boolean(),
    hasSleepwalking: z.boolean(),
    hasHypertension: z.boolean(),
    hasAddiction: z.boolean(),
    addictionDetail: z.string().optional(),
    hasDietaryRestriction: z.boolean(),
    dietaryRestrictionDetail: z.string().optional(),
    hasHealthInsurance: z.boolean(),
    healthInsuranceName: z.string().optional(),
    healthInsuranceHolder: z.string().optional(),
    painMedications: z.string().optional(),
    vaccineCovid: z.boolean().default(false),
    vaccineFlu: z.boolean().default(false),
    vaccineYellowFever: z.boolean().default(false),
    medicalRestrictions: z.string().optional(),
    continuousMedications: z.string().optional(),
    generalObservations: z.string().optional(),
  })
  .partial();

export const faithPayloadSchema = z.object({
  religion: z.string().optional(),
  parish: z.string().optional(),
  groupName: z.string().optional(),
  sacraments: z
    .array(
      z.enum([
        'batismo',
        'eucaristia',
        'crisma',
        'matrimonio',
        'ordem',
        'uncao_enfermos',
        'confissao',
      ]),
    )
    .default([]),
});

export const campParticipationSchema = z.object({
  campEdition: z.number().int().min(1).max(13),
  role: z.enum(['campista', 'equipista', 'lider']),
  tribeNameLegacy: z.string().optional(),
  serviceTeam: z.string().optional(),
  functionRole: z.string().optional(),
});

// Cadastro sem senha. mobilePhone vira o identificador.
export const baseSignupSchema = z.object({
  email: z.string().email().optional(),
  person: personPayloadSchema,
  emergencyContacts: z.array(emergencyContactSchema).min(2).max(3),
  faith: faithPayloadSchema.optional(),
  health: healthPayloadSchema.optional(),
});

export const firstTimerSignupSchema = baseSignupSchema;

export const veteranSignupSchema = baseSignupSchema.extend({
  campParticipations: z.array(campParticipationSchema).default([]),
});

export const requestCodeSchema = z.object({
  phone: phoneRaw,
});

export const verifyCodeSchema = z.object({
  phone: phoneRaw,
  code: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().length(6)),
});

export type FirstTimerSignup = z.infer<typeof firstTimerSignupSchema>;
export type VeteranSignup = z.infer<typeof veteranSignupSchema>;
export type RequestCode = z.infer<typeof requestCodeSchema>;
export type VerifyCode = z.infer<typeof verifyCodeSchema>;
export type HealthPayload = z.infer<typeof healthPayloadSchema>;
