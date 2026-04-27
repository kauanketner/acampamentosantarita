import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { eq } from 'drizzle-orm';
import type { FaithUpsert } from './schemas.ts';

export const faithService = {
  async getMine(db: Database, personId: string) {
    const [profile] = await db
      .select()
      .from(schema.faithProfiles)
      .where(eq(schema.faithProfiles.personId, personId))
      .limit(1);
    const sacraments = await db
      .select({ sacrament: schema.receivedSacraments.sacrament })
      .from(schema.receivedSacraments)
      .where(eq(schema.receivedSacraments.personId, personId));
    return {
      profile: profile ?? null,
      sacraments: sacraments.map((s) => s.sacrament),
    };
  },

  async upsertMine(db: Database, personId: string, payload: FaithUpsert) {
    const now = new Date();
    const [existing] = await db
      .select({ id: schema.faithProfiles.id })
      .from(schema.faithProfiles)
      .where(eq(schema.faithProfiles.personId, personId))
      .limit(1);

    const profileValues = {
      personId,
      religion: payload.religion ?? null,
      parish: payload.parish ?? null,
      groupName: payload.groupName ?? null,
      updatedAt: now,
    };

    await db.transaction(async (tx) => {
      if (existing) {
        await tx
          .update(schema.faithProfiles)
          .set(profileValues)
          .where(eq(schema.faithProfiles.personId, personId));
      } else {
        await tx.insert(schema.faithProfiles).values(profileValues);
      }
      await tx
        .delete(schema.receivedSacraments)
        .where(eq(schema.receivedSacraments.personId, personId));
      if (payload.sacraments.length > 0) {
        await tx.insert(schema.receivedSacraments).values(
          payload.sacraments.map((s) => ({
            personId,
            sacrament: s,
          })),
        );
      }
    });

    return faithService.getMine(db, personId);
  },
};
