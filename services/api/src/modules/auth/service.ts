import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { eq } from 'drizzle-orm';
import { consumeAuthCode, issueAuthCode } from '../../lib/auth-codes.ts';
import { toE164 } from '../../lib/whatsapp.ts';
import type { FirstTimerSignup, HealthPayload, VeteranSignup } from './schemas.ts';

export class AuthError extends Error {
  constructor(
    public code:
      | 'PHONE_TAKEN'
      | 'CPF_TAKEN'
      | 'EMAIL_TAKEN'
      | 'USER_NOT_FOUND'
      | 'INVALID_CODE'
      | 'EXPIRED_CODE'
      | 'TOO_MANY_ATTEMPTS',
    message: string,
  ) {
    super(message);
  }
}

export const authService = {
  async registerFirstTimer(db: Database, payload: FirstTimerSignup) {
    return registerCommon(db, payload, []);
  },

  async registerVeteran(db: Database, payload: VeteranSignup) {
    return registerCommon(db, payload, payload.campParticipations);
  },

  /** Solicita um código OTP. Sempre retorna sucesso (não revela existência). */
  async requestCode(db: Database, phoneRaw: string) {
    const phoneE164 = toE164(phoneRaw);

    const [user] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.phone, phoneE164))
      .limit(1);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    if (!user) {
      // Privacidade: não revela se a conta existe.
      return { phoneE164, expiresAt, exists: false };
    }

    const sent = await issueAuthCode(db, phoneE164, 'login');
    return { phoneE164, expiresAt: sent.expiresAt, exists: true };
  },

  async verifyCode(db: Database, phoneRaw: string, code: string) {
    const phoneE164 = toE164(phoneRaw);
    const result = await consumeAuthCode(db, phoneE164, code);
    if (!result.ok) {
      const reasonMap = {
        EXPIRED: 'EXPIRED_CODE',
        INVALID: 'INVALID_CODE',
        TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
      } as const;
      throw new AuthError(
        reasonMap[result.reason ?? 'INVALID'],
        result.reason === 'EXPIRED'
          ? 'Código expirado. Peça um novo.'
          : result.reason === 'TOO_MANY_ATTEMPTS'
            ? 'Muitas tentativas. Peça um novo código.'
            : 'Código inválido.',
      );
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, phoneE164))
      .limit(1);
    if (!user) throw new AuthError('USER_NOT_FOUND', 'Conta não encontrada.');

    await db
      .update(schema.users)
      .set({ lastLoginAt: new Date() })
      .where(eq(schema.users.id, user.id));

    return user;
  },

  async fetchMe(db: Database, userId: string) {
    const [me] = await db
      .select({ user: schema.users, person: schema.persons })
      .from(schema.users)
      .leftJoin(schema.persons, eq(schema.users.personId, schema.persons.id))
      .where(eq(schema.users.id, userId))
      .limit(1);
    return me;
  },
};

async function registerCommon(
  db: Database,
  payload: FirstTimerSignup,
  campParticipations: Array<{
    campEdition: number;
    role: 'campista' | 'equipista' | 'lider';
    tribeNameLegacy?: string;
    serviceTeam?: string;
    functionRole?: string;
  }>,
) {
  const phoneE164 = toE164(payload.person.mobilePhone);
  const email = payload.email?.toLowerCase().trim();

  // Pré-checagens
  const [existingPhone] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.phone, phoneE164))
    .limit(1);
  if (existingPhone) {
    throw new AuthError('PHONE_TAKEN', 'Já existe uma conta com este telefone.');
  }
  if (email) {
    const [existingEmail] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    if (existingEmail) throw new AuthError('EMAIL_TAKEN', 'Este e-mail já está em uso.');
  }
  if (payload.person.cpf) {
    const [existingCpf] = await db
      .select({ id: schema.persons.id })
      .from(schema.persons)
      .where(eq(schema.persons.cpf, payload.person.cpf))
      .limit(1);
    if (existingCpf) throw new AuthError('CPF_TAKEN', 'Já existe um cadastro com este CPF.');
  }

  const created = await db.transaction(async (tx) => {
    const [insertedPerson] = await tx
      .insert(schema.persons)
      .values({
        fullName: payload.person.fullName,
        gender: payload.person.gender,
        birthDate: payload.person.birthDate,
        cpf: payload.person.cpf,
        maritalStatus: payload.person.maritalStatus,
        heightCm: payload.person.heightCm,
        weightKg: payload.person.weightKg?.toString(),
        shirtSize: payload.person.shirtSize,
        mobilePhone: phoneE164,
        zipCode: payload.person.zipCode,
        street: payload.person.street,
        neighborhood: payload.person.neighborhood,
        city: payload.person.city,
        state: payload.person.state?.toUpperCase(),
        addressNumber: payload.person.addressNumber,
        addressComplement: payload.person.addressComplement,
        avatarUrl: payload.person.avatarUrl,
        profileCompletedAt: new Date(),
      })
      .returning();

    const [insertedUser] = await tx
      .insert(schema.users)
      .values({
        email: email ?? null,
        phone: phoneE164,
        role: 'participante',
        personId: insertedPerson!.id,
      })
      .returning();

    if (payload.emergencyContacts.length) {
      await tx.insert(schema.emergencyContacts).values(
        payload.emergencyContacts.map((c, i) => ({
          personId: insertedPerson!.id,
          name: c.name,
          relationship: c.relationship,
          phone: c.phone,
          order: i + 1,
        })),
      );
    }

    const h = (payload.health ?? {}) as HealthPayload;
    await tx.insert(schema.healthProfiles).values({
      personId: insertedPerson!.id,
      hasChronicDisease: h.hasChronicDisease ?? false,
      chronicDiseaseDetail: h.chronicDiseaseDetail,
      hadSurgery: h.hadSurgery ?? false,
      surgeryDetail: h.surgeryDetail,
      hasSenseDisability: h.hasSenseDisability ?? false,
      senseDisabilityDetail: h.senseDisabilityDetail,
      hasDisability: h.hasDisability ?? false,
      disabilityType: h.disabilityType,
      hasAllergy: h.hasAllergy ?? false,
      allergyDetail: h.allergyDetail,
      hasAsthma: h.hasAsthma ?? false,
      usesInhaler: h.usesInhaler ?? false,
      hasDiabetes: h.hasDiabetes ?? false,
      insulinDependent: h.insulinDependent ?? false,
      hasSleepwalking: h.hasSleepwalking ?? false,
      hasHypertension: h.hasHypertension ?? false,
      hasAddiction: h.hasAddiction ?? false,
      addictionDetail: h.addictionDetail,
      hasDietaryRestriction: h.hasDietaryRestriction ?? false,
      dietaryRestrictionDetail: h.dietaryRestrictionDetail,
      hasHealthInsurance: h.hasHealthInsurance ?? false,
      healthInsuranceName: h.healthInsuranceName,
      healthInsuranceHolder: h.healthInsuranceHolder,
      painMedications: h.painMedications,
      vaccineCovid: h.vaccineCovid ?? false,
      vaccineFlu: h.vaccineFlu ?? false,
      vaccineYellowFever: h.vaccineYellowFever ?? false,
      medicalRestrictions: h.medicalRestrictions,
      continuousMedications: h.continuousMedications,
      generalObservations: h.generalObservations,
      lastReviewedAt: new Date(),
    });

    if (payload.faith) {
      await tx.insert(schema.faithProfiles).values({
        personId: insertedPerson!.id,
        religion: payload.faith.religion,
        parish: payload.faith.parish,
        groupName: payload.faith.groupName,
      });
      if (payload.faith.sacraments.length) {
        await tx.insert(schema.receivedSacraments).values(
          payload.faith.sacraments.map((s) => ({
            personId: insertedPerson!.id,
            sacrament: s,
          })),
        );
      }
    }

    if (campParticipations.length) {
      await tx.insert(schema.campParticipations).values(
        campParticipations.map((p) => ({
          personId: insertedPerson!.id,
          campEdition: p.campEdition,
          campYear: 2025 - (13 - p.campEdition),
          role: p.role,
          tribeNameLegacy: p.tribeNameLegacy,
          functionRole: p.functionRole,
          isLegacy: true,
        })),
      );
    }

    return { user: insertedUser!, person: insertedPerson!, phoneE164 };
  });

  // Após cadastro, dispara código para confirmar telefone
  const code = await issueAuthCode(db, created.phoneE164, 'register');
  return { ...created, codeExpiresAt: code.expiresAt };
}
