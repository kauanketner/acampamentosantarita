import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, desc, eq, ne } from 'drizzle-orm';
import type {
  AddGalleryPhoto,
  CreateFaqItem,
  CreateGalleryAlbum,
  UpdateFaqItem,
  UpdateGalleryAlbum,
} from './schemas.ts';

export class CmsError extends Error {
  constructor(public code: 'NOT_FOUND' | 'SLUG_TAKEN', message: string) {
    super(message);
  }
}

export const cmsService = {
  // ===== FAQ =====

  async listFaqAll(db: Database) {
    return db
      .select()
      .from(schema.faqItems)
      .orderBy(asc(schema.faqItems.sortOrder), asc(schema.faqItems.createdAt));
  },

  async createFaq(db: Database, payload: CreateFaqItem) {
    const [created] = await db
      .insert(schema.faqItems)
      .values({
        question: payload.question,
        answer: payload.answer,
        category: payload.category ?? null,
        sortOrder: payload.sortOrder,
        published: payload.published,
      })
      .returning();
    return created!;
  },

  async updateFaq(db: Database, id: string, payload: UpdateFaqItem) {
    const [existing] = await db
      .select({ id: schema.faqItems.id })
      .from(schema.faqItems)
      .where(eq(schema.faqItems.id, id))
      .limit(1);
    if (!existing) throw new CmsError('NOT_FOUND', 'Pergunta não encontrada.');

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      patch[key] = value;
    }

    const [updated] = await db
      .update(schema.faqItems)
      .set(patch)
      .where(eq(schema.faqItems.id, id))
      .returning();
    return updated!;
  },

  async deleteFaq(db: Database, id: string) {
    const [existing] = await db
      .select({ id: schema.faqItems.id })
      .from(schema.faqItems)
      .where(eq(schema.faqItems.id, id))
      .limit(1);
    if (!existing) throw new CmsError('NOT_FOUND', 'Pergunta não encontrada.');
    await db.delete(schema.faqItems).where(eq(schema.faqItems.id, id));
  },

  // ===== Gallery =====

  async listAlbumsAll(db: Database) {
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
      .leftJoin(
        schema.events,
        eq(schema.galleryAlbums.eventId, schema.events.id),
      )
      .orderBy(
        desc(schema.galleryAlbums.published),
        asc(schema.galleryAlbums.sortOrder),
        desc(schema.galleryAlbums.createdAt),
      );

    if (rows.length === 0) return [];

    const ids = rows.map((r) => r.album.id);
    const photoRows = await db
      .select({ albumId: schema.galleryPhotos.albumId })
      .from(schema.galleryPhotos);

    const counts = new Map<string, number>();
    for (const p of photoRows) {
      if (!ids.includes(p.albumId)) continue;
      counts.set(p.albumId, (counts.get(p.albumId) ?? 0) + 1);
    }

    return rows.map((r) => ({
      ...r.album,
      event: r.event?.id ? r.event : null,
      photoCount: counts.get(r.album.id) ?? 0,
    }));
  },

  async getAlbumById(db: Database, albumId: string) {
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
      .leftJoin(
        schema.events,
        eq(schema.galleryAlbums.eventId, schema.events.id),
      )
      .where(eq(schema.galleryAlbums.id, albumId))
      .limit(1);
    if (!row) return null;

    const photos = await db
      .select()
      .from(schema.galleryPhotos)
      .where(eq(schema.galleryPhotos.albumId, albumId))
      .orderBy(
        asc(schema.galleryPhotos.sortOrder),
        asc(schema.galleryPhotos.createdAt),
      );

    return {
      ...row.album,
      event: row.event?.id ? row.event : null,
      photos,
    };
  },

  async createAlbum(db: Database, payload: CreateGalleryAlbum) {
    const [existing] = await db
      .select({ id: schema.galleryAlbums.id })
      .from(schema.galleryAlbums)
      .where(eq(schema.galleryAlbums.slug, payload.slug))
      .limit(1);
    if (existing) throw new CmsError('SLUG_TAKEN', 'Slug já em uso.');

    const [created] = await db
      .insert(schema.galleryAlbums)
      .values({
        name: payload.name,
        slug: payload.slug,
        description: payload.description ?? null,
        coverUrl: payload.coverUrl ?? null,
        eventId: payload.eventId ?? null,
        published: payload.published,
        sortOrder: payload.sortOrder,
      })
      .returning();
    return created!;
  },

  async updateAlbum(db: Database, id: string, payload: UpdateGalleryAlbum) {
    const [existing] = await db
      .select()
      .from(schema.galleryAlbums)
      .where(eq(schema.galleryAlbums.id, id))
      .limit(1);
    if (!existing) throw new CmsError('NOT_FOUND', 'Álbum não encontrado.');

    if (payload.slug && payload.slug !== existing.slug) {
      const [other] = await db
        .select({ id: schema.galleryAlbums.id })
        .from(schema.galleryAlbums)
        .where(
          and(
            eq(schema.galleryAlbums.slug, payload.slug),
            ne(schema.galleryAlbums.id, id),
          ),
        )
        .limit(1);
      if (other) throw new CmsError('SLUG_TAKEN', 'Slug já em uso.');
    }

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      patch[key] = value;
    }

    const [updated] = await db
      .update(schema.galleryAlbums)
      .set(patch)
      .where(eq(schema.galleryAlbums.id, id))
      .returning();
    return updated!;
  },

  async deleteAlbum(db: Database, id: string) {
    const [existing] = await db
      .select({ id: schema.galleryAlbums.id })
      .from(schema.galleryAlbums)
      .where(eq(schema.galleryAlbums.id, id))
      .limit(1);
    if (!existing) throw new CmsError('NOT_FOUND', 'Álbum não encontrado.');
    await db.delete(schema.galleryAlbums).where(eq(schema.galleryAlbums.id, id));
  },

  async addPhoto(db: Database, albumId: string, payload: AddGalleryPhoto) {
    const [album] = await db
      .select({ id: schema.galleryAlbums.id })
      .from(schema.galleryAlbums)
      .where(eq(schema.galleryAlbums.id, albumId))
      .limit(1);
    if (!album) throw new CmsError('NOT_FOUND', 'Álbum não encontrado.');

    const [created] = await db
      .insert(schema.galleryPhotos)
      .values({
        albumId,
        imageUrl: payload.imageUrl,
        caption: payload.caption ?? null,
        sortOrder: payload.sortOrder,
      })
      .returning();
    return created!;
  },

  async deletePhoto(db: Database, photoId: string) {
    const [existing] = await db
      .select({ id: schema.galleryPhotos.id })
      .from(schema.galleryPhotos)
      .where(eq(schema.galleryPhotos.id, photoId))
      .limit(1);
    if (!existing) throw new CmsError('NOT_FOUND', 'Foto não encontrada.');
    await db.delete(schema.galleryPhotos).where(eq(schema.galleryPhotos.id, photoId));
  },
};
