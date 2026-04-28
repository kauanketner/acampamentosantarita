import { z } from 'zod';

export const healthUpsertSchema = z
  .object({
    hasChronicDisease: z.boolean().optional(),
    chronicDiseaseDetail: z.string().nullable().optional(),
    hadSurgery: z.boolean().optional(),
    surgeryDetail: z.string().nullable().optional(),
    hasSenseDisability: z.boolean().optional(),
    senseDisabilityDetail: z.string().nullable().optional(),
    hasDisability: z.boolean().optional(),
    disabilityType: z.enum(['fisica', 'visual', 'auditiva', 'intelectual']).nullable().optional(),
    hasAllergy: z.boolean().optional(),
    allergyDetail: z.string().nullable().optional(),
    hasAsthma: z.boolean().optional(),
    usesInhaler: z.boolean().optional(),
    hasDiabetes: z.boolean().optional(),
    insulinDependent: z.boolean().optional(),
    hasSleepwalking: z.boolean().optional(),
    hasHypertension: z.boolean().optional(),
    hasAddiction: z.boolean().optional(),
    addictionDetail: z.string().nullable().optional(),
    hasDietaryRestriction: z.boolean().optional(),
    dietaryRestrictionDetail: z.string().nullable().optional(),
    hasHealthInsurance: z.boolean().optional(),
    healthInsuranceName: z.string().nullable().optional(),
    healthInsuranceHolder: z.string().nullable().optional(),
    painMedications: z.string().nullable().optional(),
    vaccineCovid: z.boolean().optional(),
    vaccineFlu: z.boolean().optional(),
    vaccineYellowFever: z.boolean().optional(),
    medicalRestrictions: z.string().nullable().optional(),
    continuousMedications: z.string().nullable().optional(),
    generalObservations: z.string().nullable().optional(),
  })
  .strict();

export type HealthUpsert = z.infer<typeof healthUpsertSchema>;
