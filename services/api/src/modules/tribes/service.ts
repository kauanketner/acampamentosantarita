import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, desc, eq } from 'drizzle-orm';

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
};
