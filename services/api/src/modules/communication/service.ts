import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { desc, eq, isNotNull } from 'drizzle-orm';
import type {
  CreateAnnouncement,
  UpdateAnnouncement,
} from './schemas.ts';

export class AnnouncementError extends Error {
  constructor(public code: 'NOT_FOUND', message: string) {
    super(message);
  }
}

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

  // Admin — lista TODOS (incluindo rascunhos), do mais recente pro mais antigo.
  async listAllForAdmin(db: Database, limit = 200) {
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
      .orderBy(desc(schema.announcements.createdAt))
      .limit(limit);

    return rows.map((r) => ({
      ...r.announcement,
      event: r.event?.id ? r.event : null,
    }));
  },

  async create(
    db: Database,
    payload: CreateAnnouncement,
    publishedByUserId: string,
  ) {
    const now = new Date();
    const [created] = await db
      .insert(schema.announcements)
      .values({
        eventId: payload.eventId ?? null,
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl ?? null,
        targetAudience: payload.targetAudience,
        targetId: payload.targetId ?? null,
        sendPush: payload.sendPush,
        publishedAt: payload.publish ? now : null,
        publishedByUserId: payload.publish ? publishedByUserId : null,
      })
      .returning();
    return created!;
  },

  async update(
    db: Database,
    id: string,
    payload: UpdateAnnouncement,
    publishedByUserId: string,
  ) {
    const [existing] = await db
      .select()
      .from(schema.announcements)
      .where(eq(schema.announcements.id, id))
      .limit(1);
    if (!existing) {
      throw new AnnouncementError('NOT_FOUND', 'Aviso não encontrado.');
    }

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (payload.title !== undefined) patch.title = payload.title;
    if (payload.body !== undefined) patch.body = payload.body;
    if (payload.imageUrl !== undefined) patch.imageUrl = payload.imageUrl;
    if (payload.eventId !== undefined) patch.eventId = payload.eventId;
    if (payload.targetAudience !== undefined)
      patch.targetAudience = payload.targetAudience;
    if (payload.targetId !== undefined) patch.targetId = payload.targetId;
    if (payload.sendPush !== undefined) patch.sendPush = payload.sendPush;
    if (payload.publish !== undefined) {
      if (payload.publish) {
        // Só seta publishedAt se ainda não estava publicado
        if (!existing.publishedAt) {
          patch.publishedAt = new Date();
          patch.publishedByUserId = publishedByUserId;
        }
      } else {
        // Despublicar volta pra rascunho
        patch.publishedAt = null;
        patch.publishedByUserId = null;
      }
    }

    const [updated] = await db
      .update(schema.announcements)
      .set(patch)
      .where(eq(schema.announcements.id, id))
      .returning();
    return updated!;
  },

  async delete(db: Database, id: string) {
    const [existing] = await db
      .select({ id: schema.announcements.id })
      .from(schema.announcements)
      .where(eq(schema.announcements.id, id))
      .limit(1);
    if (!existing) {
      throw new AnnouncementError('NOT_FOUND', 'Aviso não encontrado.');
    }
    await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
  },
};
