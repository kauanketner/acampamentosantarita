import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { eq } from 'drizzle-orm';
import type { HealthUpsert } from './schemas.ts';

export const healthService = {
  async getMine(db: Database, personId: string) {
    const [row] = await db
      .select()
      .from(schema.healthProfiles)
      .where(eq(schema.healthProfiles.personId, personId))
      .limit(1);
    return row ?? null;
  },

  async upsertMine(db: Database, personId: string, payload: HealthUpsert) {
    const now = new Date();
    const [existing] = await db
      .select({ id: schema.healthProfiles.id })
      .from(schema.healthProfiles)
      .where(eq(schema.healthProfiles.personId, personId))
      .limit(1);

    const values = {
      personId,
      hasChronicDisease: payload.hasChronicDisease ?? false,
      chronicDiseaseDetail: payload.chronicDiseaseDetail ?? null,
      hadSurgery: payload.hadSurgery ?? false,
      surgeryDetail: payload.surgeryDetail ?? null,
      hasSenseDisability: payload.hasSenseDisability ?? false,
      senseDisabilityDetail: payload.senseDisabilityDetail ?? null,
      hasDisability: payload.hasDisability ?? false,
      disabilityType: payload.disabilityType ?? null,
      hasAllergy: payload.hasAllergy ?? false,
      allergyDetail: payload.allergyDetail ?? null,
      hasAsthma: payload.hasAsthma ?? false,
      usesInhaler: payload.usesInhaler ?? false,
      hasDiabetes: payload.hasDiabetes ?? false,
      insulinDependent: payload.insulinDependent ?? false,
      hasSleepwalking: payload.hasSleepwalking ?? false,
      hasHypertension: payload.hasHypertension ?? false,
      hasAddiction: payload.hasAddiction ?? false,
      addictionDetail: payload.addictionDetail ?? null,
      hasDietaryRestriction: payload.hasDietaryRestriction ?? false,
      dietaryRestrictionDetail: payload.dietaryRestrictionDetail ?? null,
      hasHealthInsurance: payload.hasHealthInsurance ?? false,
      healthInsuranceName: payload.healthInsuranceName ?? null,
      healthInsuranceHolder: payload.healthInsuranceHolder ?? null,
      painMedications: payload.painMedications ?? null,
      vaccineCovid: payload.vaccineCovid ?? false,
      vaccineFlu: payload.vaccineFlu ?? false,
      vaccineYellowFever: payload.vaccineYellowFever ?? false,
      medicalRestrictions: payload.medicalRestrictions ?? null,
      continuousMedications: payload.continuousMedications ?? null,
      generalObservations: payload.generalObservations ?? null,
      lastReviewedAt: now,
      updatedAt: now,
    };

    if (existing) {
      await db
        .update(schema.healthProfiles)
        .set(values)
        .where(eq(schema.healthProfiles.personId, personId));
    } else {
      await db.insert(schema.healthProfiles).values(values);
    }

    return healthService.getMine(db, personId);
  },
};
