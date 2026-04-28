import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, count, desc, eq, isNull, ne, sql } from 'drizzle-orm';
import type {
  CreateCustomQuestion,
  CreateEvent,
  UpdateCustomQuestion,
  UpdateEvent,
} from './schemas.ts';

export class EventError extends Error {
  constructor(
    public code: 'NOT_FOUND' | 'SLUG_TAKEN' | 'IN_USE',
    message: string,
  ) {
    super(message);
  }
}

export const eventsService = {
  async getById(db: Database, id: string) {
    const [row] = await db
      .select()
      .from(schema.events)
      .where(and(eq(schema.events.id, id), isNull(schema.events.deletedAt)))
      .limit(1);
    return row ?? null;
  },

  async listCustomQuestions(db: Database, eventId: string) {
    const rows = await db
      .select()
      .from(schema.eventCustomQuestions)
      .where(eq(schema.eventCustomQuestions.eventId, eventId))
      .orderBy(schema.eventCustomQuestions.order);
    return rows;
  },

  // Admin — lista todos eventos não deletados com contagem de inscrições.
  async listAll(db: Database) {
    const events = await db
      .select()
      .from(schema.events)
      .where(isNull(schema.events.deletedAt))
      .orderBy(desc(schema.events.startDate));

    if (events.length === 0) return [];

    const counts = await db
      .select({
        eventId: schema.registrations.eventId,
        total: count().as('total'),
        approved:
          sql<number>`count(*) filter (where ${schema.registrations.status} in ('aprovada', 'confirmada'))`.as(
            'approved',
          ),
        pending:
          sql<number>`count(*) filter (where ${schema.registrations.status} = 'pendente')`.as(
            'pending',
          ),
      })
      .from(schema.registrations)
      .groupBy(schema.registrations.eventId);

    const countByEvent = new Map(counts.map((c) => [c.eventId, c]));

    return events.map((e) => {
      const c = countByEvent.get(e.id);
      return {
        ...e,
        registrationCount: Number(c?.total ?? 0),
        approvedCount: Number(c?.approved ?? 0),
        pendingCount: Number(c?.pending ?? 0),
      };
    });
  },

  async create(db: Database, payload: CreateEvent) {
    const [existing] = await db
      .select({ id: schema.events.id })
      .from(schema.events)
      .where(eq(schema.events.slug, payload.slug))
      .limit(1);
    if (existing) {
      throw new EventError('SLUG_TAKEN', 'Já existe um evento com esse slug.');
    }

    const [created] = await db
      .insert(schema.events)
      .values({
        name: payload.name,
        slug: payload.slug,
        type: payload.type,
        editionNumber: payload.editionNumber ?? null,
        startDate: payload.startDate,
        endDate: payload.endDate,
        location: payload.location ?? null,
        description: payload.description ?? null,
        coverImageUrl: payload.coverImageUrl ?? null,
        status: payload.status,
        maxParticipants: payload.maxParticipants ?? null,
        allowFirstTimer: payload.allowFirstTimer,
        isPaid: payload.isPaid,
        priceCampista: payload.priceCampista ?? null,
        priceEquipista: payload.priceEquipista ?? null,
        registrationDeadline: payload.registrationDeadline
          ? new Date(payload.registrationDeadline)
          : null,
        allowRegistrationViaApp: payload.allowRegistrationViaApp,
        allowRegistrationViaSite: payload.allowRegistrationViaSite,
        requiresAdminApproval: payload.requiresAdminApproval,
      })
      .returning();
    return created!;
  },

  async update(db: Database, id: string, payload: UpdateEvent) {
    const existing = await eventsService.getById(db, id);
    if (!existing) throw new EventError('NOT_FOUND', 'Evento não encontrado.');

    if (payload.slug && payload.slug !== existing.slug) {
      const [other] = await db
        .select({ id: schema.events.id })
        .from(schema.events)
        .where(and(eq(schema.events.slug, payload.slug), ne(schema.events.id, id)))
        .limit(1);
      if (other) {
        throw new EventError('SLUG_TAKEN', 'Já existe um evento com esse slug.');
      }
    }

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      if (key === 'registrationDeadline') {
        patch[key] = value ? new Date(value as string) : null;
      } else {
        patch[key] = value;
      }
    }

    const [updated] = await db
      .update(schema.events)
      .set(patch)
      .where(eq(schema.events.id, id))
      .returning();
    return updated!;
  },

  async softDelete(db: Database, id: string) {
    const existing = await eventsService.getById(db, id);
    if (!existing) throw new EventError('NOT_FOUND', 'Evento não encontrado.');

    await db
      .update(schema.events)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.events.id, id));
  },

  async createCustomQuestion(db: Database, eventId: string, payload: CreateCustomQuestion) {
    const event = await eventsService.getById(db, eventId);
    if (!event) throw new EventError('NOT_FOUND', 'Evento não encontrado.');

    const [created] = await db
      .insert(schema.eventCustomQuestions)
      .values({
        eventId,
        question: payload.question,
        type: payload.type,
        options: payload.options ?? null,
        required: payload.required,
        order: payload.order,
        appliesTo: payload.appliesTo,
      })
      .returning();
    return created!;
  },

  async updateCustomQuestion(db: Database, questionId: string, payload: UpdateCustomQuestion) {
    const [existing] = await db
      .select()
      .from(schema.eventCustomQuestions)
      .where(eq(schema.eventCustomQuestions.id, questionId))
      .limit(1);
    if (!existing) throw new EventError('NOT_FOUND', 'Pergunta não encontrada.');

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      patch[key] = value;
    }

    const [updated] = await db
      .update(schema.eventCustomQuestions)
      .set(patch)
      .where(eq(schema.eventCustomQuestions.id, questionId))
      .returning();
    return updated!;
  },

  async deleteCustomQuestion(db: Database, questionId: string) {
    await db
      .delete(schema.eventCustomQuestions)
      .where(eq(schema.eventCustomQuestions.id, questionId));
  },
};
