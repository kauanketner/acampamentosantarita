import { relations } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { persons } from './persons.ts';

export const disabilityTypeEnum = pgEnum('disability_type', [
  'fisica',
  'visual',
  'auditiva',
  'intelectual',
]);

// Passo 5 do cadastro — 19 perguntas + revisão a cada inscrição.
export const healthProfiles = pgTable('health_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .unique()
    .references(() => persons.id, { onDelete: 'cascade' }),

  hasChronicDisease: boolean('has_chronic_disease').notNull().default(false),
  chronicDiseaseDetail: text('chronic_disease_detail'),

  hadSurgery: boolean('had_surgery').notNull().default(false),
  surgeryDetail: text('surgery_detail'),

  hasSenseDisability: boolean('has_sense_disability').notNull().default(false),
  senseDisabilityDetail: text('sense_disability_detail'),

  hasDisability: boolean('has_disability').notNull().default(false),
  disabilityType: disabilityTypeEnum('disability_type'),

  hasAllergy: boolean('has_allergy').notNull().default(false),
  allergyDetail: text('allergy_detail'),

  hasAsthma: boolean('has_asthma').notNull().default(false),
  usesInhaler: boolean('uses_inhaler').notNull().default(false),

  hasDiabetes: boolean('has_diabetes').notNull().default(false),
  insulinDependent: boolean('insulin_dependent').notNull().default(false),

  hasSleepwalking: boolean('has_sleepwalking').notNull().default(false),
  hasHypertension: boolean('has_hypertension').notNull().default(false),

  hasAddiction: boolean('has_addiction').notNull().default(false),
  addictionDetail: text('addiction_detail'),

  hasDietaryRestriction: boolean('has_dietary_restriction').notNull().default(false),
  dietaryRestrictionDetail: text('dietary_restriction_detail'),

  hasHealthInsurance: boolean('has_health_insurance').notNull().default(false),
  healthInsuranceName: text('health_insurance_name'),
  healthInsuranceHolder: text('health_insurance_holder'),

  painMedications: text('pain_medications'),

  vaccineCovid: boolean('vaccine_covid').notNull().default(false),
  vaccineFlu: boolean('vaccine_flu').notNull().default(false),
  vaccineYellowFever: boolean('vaccine_yellow_fever').notNull().default(false),

  medicalRestrictions: text('medical_restrictions'),
  continuousMedications: text('continuous_medications'),
  generalObservations: text('general_observations'),

  // atualizado em cada inscrição (revisão rápida)
  lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const healthProfilesRelations = relations(healthProfiles, ({ one }) => ({
  person: one(persons, {
    fields: [healthProfiles.personId],
    references: [persons.id],
  }),
}));
