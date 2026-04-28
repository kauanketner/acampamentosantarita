import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, desc, eq, ilike, isNull, or } from 'drizzle-orm';
import { toE164 } from '../../lib/whatsapp.ts';
import type { PersonUpdate } from './schemas.ts';

export const personsService = {
  async listAdmin(
    db: Database,
    opts: { search?: string; limit?: number } = {},
  ) {
    const limit = opts.limit ?? 200;
    const where = [isNull(schema.persons.deletedAt)];
    if (opts.search?.trim()) {
      const q = `%${opts.search.trim()}%`;
      where.push(
        or(
          ilike(schema.persons.fullName, q),
          ilike(schema.persons.cpf, q),
          ilike(schema.persons.mobilePhone, q),
        )!,
      );
    }
    const rows = await db
      .select({
        person: schema.persons,
        userId: schema.users.id,
        role: schema.users.role,
        email: schema.users.email,
      })
      .from(schema.persons)
      .leftJoin(schema.users, eq(schema.users.personId, schema.persons.id))
      .where(and(...where))
      .orderBy(asc(schema.persons.fullName))
      .limit(limit);

    return rows.map((r) => ({
      ...r.person,
      user: r.userId
        ? { id: r.userId, role: r.role!, email: r.email }
        : null,
    }));
  },

  async getByIdAdmin(db: Database, personId: string) {
    const [row] = await db
      .select({
        person: schema.persons,
        userId: schema.users.id,
        role: schema.users.role,
        email: schema.users.email,
      })
      .from(schema.persons)
      .leftJoin(schema.users, eq(schema.users.personId, schema.persons.id))
      .where(eq(schema.persons.id, personId))
      .limit(1);
    if (!row) return null;
    return {
      ...row.person,
      user: row.userId
        ? { id: row.userId, role: row.role!, email: row.email }
        : null,
    };
  },

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
      contacts: contacts.sort((a, b) => a.order - b.order),
      sacraments: sacraments.map((s) => s.sacrament),
      participations: participations.sort((a, b) => b.campEdition - a.campEdition),
    };
  },

  async updateAvatar(db: Database, personId: string, avatarUrl: string) {
    await db
      .update(schema.persons)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(schema.persons.id, personId));
  },

  async updatePerson(db: Database, personId: string, payload: PersonUpdate) {
    const { emergencyContacts, mobilePhone, ...rest } = payload;

    const personPatch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) personPatch[key] = value;
    }
    if (mobilePhone !== undefined) {
      personPatch.mobilePhone = toE164(mobilePhone);
    }
    if (typeof personPatch.state === 'string') {
      personPatch.state = (personPatch.state as string).toUpperCase();
    }
    if (typeof personPatch.weightKg === 'number') {
      personPatch.weightKg = (personPatch.weightKg as number).toString();
    }

    await db.transaction(async (tx) => {
      if (Object.keys(personPatch).length > 1) {
        await tx
          .update(schema.persons)
          .set(personPatch)
          .where(eq(schema.persons.id, personId));
      }

      if (mobilePhone !== undefined) {
        await tx
          .update(schema.users)
          .set({ phone: personPatch.mobilePhone as string, updatedAt: new Date() })
          .where(eq(schema.users.personId, personId));
      }

      if (emergencyContacts) {
        await tx
          .delete(schema.emergencyContacts)
          .where(eq(schema.emergencyContacts.personId, personId));
        await tx.insert(schema.emergencyContacts).values(
          emergencyContacts.map((c, i) => ({
            personId,
            name: c.name,
            relationship: c.relationship,
            phone: c.phone,
            order: i + 1,
          })),
        );
      }
    });
  },
};
