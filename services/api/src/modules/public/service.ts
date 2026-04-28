import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, eq, inArray, isNull, ne } from 'drizzle-orm';

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

  async listFaq(db: Database) {
    return db
      .select()
      .from(schema.faqItems)
      .where(eq(schema.faqItems.published, true))
      .orderBy(asc(schema.faqItems.sortOrder), asc(schema.faqItems.createdAt));
  },

  async listGalleryAlbums(db: Database) {
    const rows = await db
      .select({
        album: schema.galleryAlbums,
        event: {
          id: schema.events.id,
          name: schema.events.name,
          startDate: schema.events.startDate,
        },
      })
      .from(schema.galleryAlbums)
      .leftJoin(schema.events, eq(schema.galleryAlbums.eventId, schema.events.id))
      .where(eq(schema.galleryAlbums.published, true))
      .orderBy(asc(schema.galleryAlbums.sortOrder), asc(schema.galleryAlbums.name));

    if (rows.length === 0) return [];

    const ids = rows.map((r) => r.album.id);
    const counts = await db
      .select({ albumId: schema.galleryPhotos.albumId })
      .from(schema.galleryPhotos)
      .where(inArray(schema.galleryPhotos.albumId, ids));

    const countByAlbum = new Map<string, number>();
    for (const c of counts) {
      countByAlbum.set(c.albumId, (countByAlbum.get(c.albumId) ?? 0) + 1);
    }

    return rows.map((r) => ({
      ...r.album,
      event: r.event?.id ? r.event : null,
      photoCount: countByAlbum.get(r.album.id) ?? 0,
    }));
  },

  async getGalleryAlbum(db: Database, slug: string) {
    const [row] = await db
      .select({
        album: schema.galleryAlbums,
        event: {
          id: schema.events.id,
          name: schema.events.name,
          startDate: schema.events.startDate,
        },
      })
      .from(schema.galleryAlbums)
      .leftJoin(schema.events, eq(schema.galleryAlbums.eventId, schema.events.id))
      .where(and(eq(schema.galleryAlbums.slug, slug), eq(schema.galleryAlbums.published, true)))
      .limit(1);
    if (!row) return null;

    const photos = await db
      .select()
      .from(schema.galleryPhotos)
      .where(eq(schema.galleryPhotos.albumId, row.album.id))
      .orderBy(asc(schema.galleryPhotos.sortOrder), asc(schema.galleryPhotos.createdAt));

    return {
      ...row.album,
      event: row.event?.id ? row.event : null,
      photos,
    };
  },
};
