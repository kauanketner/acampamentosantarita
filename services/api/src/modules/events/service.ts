import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, count, desc, eq, isNull, sql } from 'drizzle-orm';

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
};
