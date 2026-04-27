import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { eq } from 'drizzle-orm';

export const personsService = {
  async getFullProfile(db: Database, personId: string) {
    const [person] = await db
      .select()
      .from(schema.persons)
      .where(eq(schema.persons.id, personId))
      .limit(1);
    if (!person) return null;

    const [health, faith, contacts, sacraments, participations] = await Promise.all([
      db
        .select()
        .from(schema.healthProfiles)
        .where(eq(schema.healthProfiles.personId, personId))
        .limit(1)
        .then((r) => r[0] ?? null),
      db
        .select()
        .from(schema.faithProfiles)
        .where(eq(schema.faithProfiles.personId, personId))
        .limit(1)
        .then((r) => r[0] ?? null),
      db
        .select()
        .from(schema.emergencyContacts)
        .where(eq(schema.emergencyContacts.personId, personId)),
      db
        .select()
        .from(schema.receivedSacraments)
        .where(eq(schema.receivedSacraments.personId, personId)),
      db
        .select()
        .from(schema.campParticipations)
        .where(eq(schema.campParticipations.personId, personId)),
    ]);

    return {
      person,
      health,
      faith,
      contacts,
      sacraments: sacraments.map((s) => s.sacrament),
      participations,
    };
  },

  async updateAvatar(db: Database, personId: string, avatarUrl: string) {
    await db
      .update(schema.persons)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(schema.persons.id, personId));
  },
};
