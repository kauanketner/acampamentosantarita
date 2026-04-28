import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, desc, eq, inArray, isNull } from 'drizzle-orm';
import type { AddMember, CreateTribe, UpdateTribe } from './schemas.ts';

export class TribeError extends Error {
  constructor(
    public code:
      | 'EVENT_NOT_FOUND'
      | 'TRIBE_NOT_FOUND'
      | 'PERSON_NOT_FOUND'
      | 'ALREADY_MEMBER'
      | 'NOT_MEMBER',
    message: string,
  ) {
    super(message);
  }
}

export const tribesService = {
  // Retorna a tribo do usuário no evento mais recente em que ele é membro.
  // Quando admin ainda não liberou (isRevealedToMember=false), devolve apenas
  // o nome do evento pra UI mostrar o estado de espera.
  async getCurrentForPerson(db: Database, personId: string) {
    const [latest] = await db
      .select({
        member: schema.tribeMembers,
        tribe: schema.tribes,
        event: schema.events,
      })
      .from(schema.tribeMembers)
      .innerJoin(schema.tribes, eq(schema.tribeMembers.tribeId, schema.tribes.id))
      .innerJoin(schema.events, eq(schema.tribes.eventId, schema.events.id))
      .where(eq(schema.tribeMembers.personId, personId))
      .orderBy(desc(schema.events.startDate))
      .limit(1);

    if (!latest) return null;

    if (!latest.member.isRevealedToMember) {
      return {
        revealed: false as const,
        event: {
          id: latest.event.id,
          name: latest.event.name,
          slug: latest.event.slug,
          startDate: latest.event.startDate,
          endDate: latest.event.endDate,
          status: latest.event.status,
        },
        myRole: latest.member.role,
      };
    }

    const memberRows = await db
      .select({
        id: schema.tribeMembers.id,
        role: schema.tribeMembers.role,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
          avatarUrl: schema.persons.avatarUrl,
        },
      })
      .from(schema.tribeMembers)
      .innerJoin(schema.persons, eq(schema.tribeMembers.personId, schema.persons.id))
      .where(
        and(
          eq(schema.tribeMembers.tribeId, latest.tribe.id),
          eq(schema.tribeMembers.isRevealedToMember, true),
        ),
      )
      .orderBy(asc(schema.tribeMembers.role), asc(schema.persons.fullName));

    return {
      revealed: true as const,
      tribe: latest.tribe,
      event: {
        id: latest.event.id,
        name: latest.event.name,
        slug: latest.event.slug,
        startDate: latest.event.startDate,
        endDate: latest.event.endDate,
        status: latest.event.status,
      },
      myRole: latest.member.role,
      members: memberRows,
    };
  },

  // ===== Admin =====

  async listByEvent(db: Database, eventId: string) {
    const tribes = await db
      .select()
      .from(schema.tribes)
      .where(eq(schema.tribes.eventId, eventId))
      .orderBy(asc(schema.tribes.sortOrder), asc(schema.tribes.name));

    if (tribes.length === 0) return [];

    const tribeIds = tribes.map((t) => t.id);
    const members = await db
      .select({
        id: schema.tribeMembers.id,
        tribeId: schema.tribeMembers.tribeId,
        role: schema.tribeMembers.role,
        isRevealedToMember: schema.tribeMembers.isRevealedToMember,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
          avatarUrl: schema.persons.avatarUrl,
          mobilePhone: schema.persons.mobilePhone,
        },
      })
      .from(schema.tribeMembers)
      .innerJoin(schema.persons, eq(schema.tribeMembers.personId, schema.persons.id))
      .where(inArray(schema.tribeMembers.tribeId, tribeIds))
      .orderBy(asc(schema.tribeMembers.role), asc(schema.persons.fullName));

    const byTribe = new Map<string, typeof members>();
    for (const m of members) {
      const arr = byTribe.get(m.tribeId) ?? [];
      arr.push(m);
      byTribe.set(m.tribeId, arr);
    }

    return tribes.map((t) => ({
      ...t,
      members: byTribe.get(t.id) ?? [],
    }));
  },

  async getById(db: Database, tribeId: string) {
    const [tribe] = await db
      .select()
      .from(schema.tribes)
      .where(eq(schema.tribes.id, tribeId))
      .limit(1);
    if (!tribe) return null;

    const members = await db
      .select({
        id: schema.tribeMembers.id,
        tribeId: schema.tribeMembers.tribeId,
        role: schema.tribeMembers.role,
        isRevealedToMember: schema.tribeMembers.isRevealedToMember,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
          avatarUrl: schema.persons.avatarUrl,
          mobilePhone: schema.persons.mobilePhone,
        },
      })
      .from(schema.tribeMembers)
      .innerJoin(schema.persons, eq(schema.tribeMembers.personId, schema.persons.id))
      .where(eq(schema.tribeMembers.tribeId, tribeId))
      .orderBy(asc(schema.tribeMembers.role), asc(schema.persons.fullName));

    return { ...tribe, members };
  },

  async create(db: Database, payload: CreateTribe) {
    const [event] = await db
      .select({ id: schema.events.id })
      .from(schema.events)
      .where(and(eq(schema.events.id, payload.eventId), isNull(schema.events.deletedAt)))
      .limit(1);
    if (!event) {
      throw new TribeError('EVENT_NOT_FOUND', 'Evento não encontrado.');
    }
    const [created] = await db
      .insert(schema.tribes)
      .values({
        eventId: payload.eventId,
        name: payload.name,
        color: payload.color ?? null,
        motto: payload.motto ?? null,
        description: payload.description ?? null,
        photoUrl: payload.photoUrl ?? null,
        sortOrder: payload.sortOrder,
      })
      .returning();
    return created!;
  },

  async update(db: Database, tribeId: string, payload: UpdateTribe) {
    const [existing] = await db
      .select()
      .from(schema.tribes)
      .where(eq(schema.tribes.id, tribeId))
      .limit(1);
    if (!existing) throw new TribeError('TRIBE_NOT_FOUND', 'Tribo não encontrada.');

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      patch[key] = value;
    }

    const [updated] = await db
      .update(schema.tribes)
      .set(patch)
      .where(eq(schema.tribes.id, tribeId))
      .returning();
    return updated!;
  },

  async delete(db: Database, tribeId: string) {
    const [existing] = await db
      .select({ id: schema.tribes.id })
      .from(schema.tribes)
      .where(eq(schema.tribes.id, tribeId))
      .limit(1);
    if (!existing) throw new TribeError('TRIBE_NOT_FOUND', 'Tribo não encontrada.');

    await db.delete(schema.tribes).where(eq(schema.tribes.id, tribeId));
  },

  async addMember(db: Database, tribeId: string, payload: AddMember) {
    const [tribe] = await db
      .select({ id: schema.tribes.id })
      .from(schema.tribes)
      .where(eq(schema.tribes.id, tribeId))
      .limit(1);
    if (!tribe) throw new TribeError('TRIBE_NOT_FOUND', 'Tribo não encontrada.');

    const [person] = await db
      .select({ id: schema.persons.id })
      .from(schema.persons)
      .where(eq(schema.persons.id, payload.personId))
      .limit(1);
    if (!person) {
      throw new TribeError('PERSON_NOT_FOUND', 'Pessoa não encontrada.');
    }

    const [existing] = await db
      .select({ id: schema.tribeMembers.id })
      .from(schema.tribeMembers)
      .where(
        and(
          eq(schema.tribeMembers.tribeId, tribeId),
          eq(schema.tribeMembers.personId, payload.personId),
        ),
      )
      .limit(1);
    if (existing) {
      throw new TribeError('ALREADY_MEMBER', 'Pessoa já é membro desta tribo.');
    }

    const [created] = await db
      .insert(schema.tribeMembers)
      .values({
        tribeId,
        personId: payload.personId,
        role: payload.role,
        isRevealedToMember: false,
      })
      .returning();
    return created!;
  },

  async removeMember(db: Database, tribeId: string, personId: string) {
    const [existing] = await db
      .select({ id: schema.tribeMembers.id })
      .from(schema.tribeMembers)
      .where(
        and(eq(schema.tribeMembers.tribeId, tribeId), eq(schema.tribeMembers.personId, personId)),
      )
      .limit(1);
    if (!existing) {
      throw new TribeError('NOT_MEMBER', 'Pessoa não está nesta tribo.');
    }
    await db.delete(schema.tribeMembers).where(eq(schema.tribeMembers.id, existing.id));
  },

  // Admin libera a revelação pra todos os membros das tribos do evento.
  async revealForEvent(db: Database, eventId: string) {
    const tribes = await db
      .select({ id: schema.tribes.id })
      .from(schema.tribes)
      .where(eq(schema.tribes.eventId, eventId));

    if (tribes.length === 0) return { revealed: 0 };

    const tribeIds = tribes.map((t) => t.id);
    const updated = await db
      .update(schema.tribeMembers)
      .set({ isRevealedToMember: true, updatedAt: new Date() })
      .where(
        and(
          inArray(schema.tribeMembers.tribeId, tribeIds),
          eq(schema.tribeMembers.isRevealedToMember, false),
        ),
      )
      .returning({ id: schema.tribeMembers.id });

    return { revealed: updated.length };
  },
};
