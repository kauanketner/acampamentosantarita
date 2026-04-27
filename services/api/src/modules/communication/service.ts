import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { desc, eq, isNotNull } from 'drizzle-orm';

export const communicationService = {
  // Avisos publicados, do mais recente pro mais antigo. Inclui evento associado
  // pra UI mostrar "do 14º acampamento" quando houver.
  async listPublishedAnnouncements(db: Database, limit = 50) {
    const rows = await db
      .select({
        announcement: schema.announcements,
        event: {
          id: schema.events.id,
          name: schema.events.name,
          slug: schema.events.slug,
        },
      })
      .from(schema.announcements)
      .leftJoin(
        schema.events,
        eq(schema.announcements.eventId, schema.events.id),
      )
      .where(isNotNull(schema.announcements.publishedAt))
      .orderBy(desc(schema.announcements.publishedAt))
      .limit(limit);

    return rows.map((r) => ({
      ...r.announcement,
      event: r.event?.id ? r.event : null,
    }));
  },
};
