import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, eq, isNull, ne } from 'drizzle-orm';

// Eventos visíveis no app/site: tudo que não está em rascunho/cancelado
// e não foi soft-deleted. Inclui finalizados (vão pra "memória").
export const publicService = {
  async listEvents(db: Database) {
    const rows = await db
      .select()
      .from(schema.events)
      .where(
        and(
          isNull(schema.events.deletedAt),
          ne(schema.events.status, 'rascunho'),
          ne(schema.events.status, 'cancelado'),
        ),
      )
      .orderBy(schema.events.startDate);
    return rows;
  },

  async getEventBySlug(db: Database, slug: string) {
    const [row] = await db
      .select()
      .from(schema.events)
      .where(and(eq(schema.events.slug, slug), isNull(schema.events.deletedAt)))
      .limit(1);
    if (!row) return null;
    if (row.status === 'rascunho' || row.status === 'cancelado') return null;
    return row;
  },
};
