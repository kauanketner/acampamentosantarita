import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, desc, eq, isNull } from 'drizzle-orm';
import type { CancelRegistration, CreateRegistration } from './schemas.ts';

export class RegistrationError extends Error {
  constructor(
    public code:
      | 'EVENT_NOT_FOUND'
      | 'EVENT_CLOSED'
      | 'PERSON_NOT_FOUND'
      | 'ALREADY_REGISTERED'
      | 'FIRST_TIMER_NOT_ALLOWED'
      | 'HEALTH_PROFILE_REQUIRED'
      | 'NOT_FOUND'
      | 'NOT_OWNED'
      | 'INVALID_CANCEL',
    message: string,
  ) {
    super(message);
  }
}

const ALLOWS_NEW_REGISTRATION = ['inscricoes_abertas'] as const;

export const registrationsService = {
  async create(db: Database, personId: string, payload: CreateRegistration) {
    return db.transaction(async (tx) => {
      const [event] = await tx
        .select()
        .from(schema.events)
        .where(and(eq(schema.events.id, payload.eventId), isNull(schema.events.deletedAt)))
        .limit(1);
      if (!event) {
        throw new RegistrationError('EVENT_NOT_FOUND', 'Evento não encontrado.');
      }
      if (!ALLOWS_NEW_REGISTRATION.includes(event.status as 'inscricoes_abertas')) {
        throw new RegistrationError('EVENT_CLOSED', 'Inscrições fechadas.');
      }
      if (!event.allowRegistrationViaApp) {
        throw new RegistrationError('EVENT_CLOSED', 'Inscrições não habilitadas via app.');
      }

      // Bloqueio de duplicidade — uma inscrição ativa por pessoa por evento
      const [existing] = await tx
        .select({ id: schema.registrations.id, status: schema.registrations.status })
        .from(schema.registrations)
        .where(
          and(
            eq(schema.registrations.eventId, event.id),
            eq(schema.registrations.personId, personId),
          ),
        )
        .limit(1);
      if (existing && existing.status !== 'cancelada' && existing.status !== 'rejeitada') {
        throw new RegistrationError(
          'ALREADY_REGISTERED',
          'Você já tem uma inscrição neste evento.',
        );
      }

      // Snapshot do health_profile pra prova de revisão
      const [healthProfile] = await tx
        .select()
        .from(schema.healthProfiles)
        .where(eq(schema.healthProfiles.personId, personId))
        .limit(1);
      if (!healthProfile) {
        throw new RegistrationError(
          'HEALTH_PROFILE_REQUIRED',
          'Atualize sua saúde antes de se inscrever.',
        );
      }

      // Acampamentos numerados: bloqueia "primeira vez" se evento não permite
      if (event.type === 'acampamento' && payload.roleIntent === 'campista') {
        const previous = await tx
          .select({ id: schema.campParticipations.id })
          .from(schema.campParticipations)
          .where(eq(schema.campParticipations.personId, personId))
          .limit(1);
        if (previous.length === 0 && !event.allowFirstTimer) {
          throw new RegistrationError(
            'FIRST_TIMER_NOT_ALLOWED',
            'Este acampamento não aceita pessoas em primeira vez.',
          );
        }
      }

      const priceAmount =
        payload.roleIntent === 'campista' ? event.priceCampista : event.priceEquipista;

      const [registration] = await tx
        .insert(schema.registrations)
        .values({
          eventId: event.id,
          personId,
          roleIntent: payload.roleIntent,
          status: 'pendente',
          serviceTeamId: payload.serviceTeamId ?? null,
          paymentStatus: event.isPaid ? 'pendente' : 'isento',
          priceAmount: priceAmount ?? null,
        })
        .returning();

      // Snapshot do perfil de saúde no momento da inscrição
      await tx.insert(schema.registrationHealthSnapshots).values({
        registrationId: registration!.id,
        healthProfileSnapshot: healthProfile as unknown as Record<string, unknown>,
      });

      // Marca revisão recente do health_profile (sinaliza "revisado na inscrição")
      await tx
        .update(schema.healthProfiles)
        .set({ lastReviewedAt: new Date(), updatedAt: new Date() })
        .where(eq(schema.healthProfiles.personId, personId));

      // Persiste respostas customizadas, se houver
      if (payload.customAnswers.length > 0) {
        await tx.insert(schema.registrationAnswers).values(
          payload.customAnswers.map((a) => ({
            registrationId: registration!.id,
            customQuestionId: a.customQuestionId,
            answer: a.answer as unknown as Record<string, unknown>,
          })),
        );
      }

      return registration!;
    });
  },

  async listMine(db: Database, personId: string) {
    const rows = await db
      .select({
        registration: schema.registrations,
        event: {
          id: schema.events.id,
          name: schema.events.name,
          slug: schema.events.slug,
          type: schema.events.type,
          editionNumber: schema.events.editionNumber,
          startDate: schema.events.startDate,
          endDate: schema.events.endDate,
          location: schema.events.location,
          coverImageUrl: schema.events.coverImageUrl,
          status: schema.events.status,
        },
      })
      .from(schema.registrations)
      .innerJoin(schema.events, eq(schema.registrations.eventId, schema.events.id))
      .where(eq(schema.registrations.personId, personId))
      .orderBy(desc(schema.registrations.registeredAt));

    return rows.map((r) => ({
      ...r.registration,
      event: r.event,
    }));
  },

  async getById(db: Database, registrationId: string, personId: string) {
    const [row] = await db
      .select({
        registration: schema.registrations,
        event: schema.events,
      })
      .from(schema.registrations)
      .innerJoin(schema.events, eq(schema.registrations.eventId, schema.events.id))
      .where(eq(schema.registrations.id, registrationId))
      .limit(1);
    if (!row) {
      throw new RegistrationError('NOT_FOUND', 'Inscrição não encontrada.');
    }
    if (row.registration.personId !== personId) {
      throw new RegistrationError('NOT_OWNED', 'Inscrição não pertence ao usuário.');
    }
    const answers = await db
      .select({
        id: schema.registrationAnswers.id,
        customQuestionId: schema.registrationAnswers.customQuestionId,
        answer: schema.registrationAnswers.answer,
        question: schema.eventCustomQuestions.question,
        type: schema.eventCustomQuestions.type,
      })
      .from(schema.registrationAnswers)
      .innerJoin(
        schema.eventCustomQuestions,
        eq(schema.registrationAnswers.customQuestionId, schema.eventCustomQuestions.id),
      )
      .where(eq(schema.registrationAnswers.registrationId, registrationId));

    return { ...row.registration, event: row.event, answers };
  },

  async cancel(
    db: Database,
    registrationId: string,
    personId: string,
    payload: CancelRegistration,
  ) {
    const [existing] = await db
      .select()
      .from(schema.registrations)
      .where(eq(schema.registrations.id, registrationId))
      .limit(1);
    if (!existing) {
      throw new RegistrationError('NOT_FOUND', 'Inscrição não encontrada.');
    }
    if (existing.personId !== personId) {
      throw new RegistrationError('NOT_OWNED', 'Inscrição não pertence ao usuário.');
    }
    if (existing.status === 'cancelada') return existing;
    if (existing.status === 'confirmada' || existing.attended) {
      throw new RegistrationError(
        'INVALID_CANCEL',
        'Inscrição confirmada não pode ser cancelada pelo app.',
      );
    }
    const [updated] = await db
      .update(schema.registrations)
      .set({
        status: 'cancelada',
        cancelledAt: new Date(),
        cancellationReason: payload.reason ?? null,
        updatedAt: new Date(),
      })
      .where(eq(schema.registrations.id, registrationId))
      .returning();
    return updated!;
  },
};
