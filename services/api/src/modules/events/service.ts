import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, eq, isNull } from 'drizzle-orm';

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
};
