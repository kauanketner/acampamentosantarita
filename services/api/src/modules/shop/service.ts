import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { asc, desc, eq } from 'drizzle-orm';
import type {
  CreateShopProduct,
  UpdateShopProduct,
} from './schemas.ts';

export class ShopError extends Error {
  constructor(public code: 'NOT_FOUND', message: string) {
    super(message);
  }
}

export const shopService = {
  async listAll(db: Database) {
    return db
      .select()
      .from(schema.shopProducts)
      .orderBy(
        asc(schema.shopProducts.sortOrder),
        desc(schema.shopProducts.createdAt),
      );
  },

  async create(db: Database, payload: CreateShopProduct) {
    const [created] = await db
      .insert(schema.shopProducts)
      .values({
        name: payload.name,
        description: payload.description ?? null,
        price: payload.price,
        photos: payload.photos as unknown as Record<string, unknown>,
        category: payload.category ?? null,
        active: payload.active,
        sortOrder: payload.sortOrder,
        whatsappMessageTemplate: payload.whatsappMessageTemplate ?? null,
      })
      .returning();
    return created!;
  },

  async update(db: Database, id: string, payload: UpdateShopProduct) {
    const [existing] = await db
      .select({ id: schema.shopProducts.id })
      .from(schema.shopProducts)
      .where(eq(schema.shopProducts.id, id))
      .limit(1);
    if (!existing) throw new ShopError('NOT_FOUND', 'Produto não encontrado.');

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      patch[key] = value;
    }

    const [updated] = await db
      .update(schema.shopProducts)
      .set(patch)
      .where(eq(schema.shopProducts.id, id))
      .returning();
    return updated!;
  },

  async delete(db: Database, id: string) {
    await db
      .delete(schema.shopProducts)
      .where(eq(schema.shopProducts.id, id));
  },
};
