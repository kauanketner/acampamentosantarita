import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, asc, desc, eq } from 'drizzle-orm';
import type {
  AddAssignment,
  CreateServiceTeam,
  UpdateServiceTeam,
} from './schemas.ts';

export class ServiceTeamError extends Error {
  constructor(
    public code:
      | 'NOT_FOUND'
      | 'EVENT_NOT_FOUND'
      | 'PERSON_NOT_FOUND'
      | 'ALREADY_ASSIGNED',
    message: string,
  ) {
    super(message);
  }
}

export const serviceTeamsService = {
  async listAll(db: Database) {
    return db
      .select()
      .from(schema.serviceTeams)
      .orderBy(asc(schema.serviceTeams.name));
  },

  async getById(db: Database, id: string) {
    const [team] = await db
      .select()
      .from(schema.serviceTeams)
      .where(eq(schema.serviceTeams.id, id))
      .limit(1);
    return team ?? null;
  },

  async create(db: Database, payload: CreateServiceTeam) {
    const [created] = await db
      .insert(schema.serviceTeams)
      .values({
        name: payload.name,
        description: payload.description ?? null,
        color: payload.color ?? null,
        icon: payload.icon ?? null,
      })
      .returning();
    return created!;
  },

  async update(db: Database, id: string, payload: UpdateServiceTeam) {
    const [existing] = await db
      .select({ id: schema.serviceTeams.id })
      .from(schema.serviceTeams)
      .where(eq(schema.serviceTeams.id, id))
      .limit(1);
    if (!existing) throw new ServiceTeamError('NOT_FOUND', 'Equipe não encontrada.');

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      patch[key] = value;
    }

    const [updated] = await db
      .update(schema.serviceTeams)
      .set(patch)
      .where(eq(schema.serviceTeams.id, id))
      .returning();
    return updated!;
  },

  async delete(db: Database, id: string) {
    const [existing] = await db
      .select({ id: schema.serviceTeams.id })
      .from(schema.serviceTeams)
      .where(eq(schema.serviceTeams.id, id))
      .limit(1);
    if (!existing) throw new ServiceTeamError('NOT_FOUND', 'Equipe não encontrada.');
    await db.delete(schema.serviceTeams).where(eq(schema.serviceTeams.id, id));
  },

  // Lista todas equipes do evento, com membros agregados.
  async listByEvent(db: Database, eventId: string) {
    const teams = await db
      .select()
      .from(schema.serviceTeams)
      .orderBy(asc(schema.serviceTeams.name));

    if (teams.length === 0) return [];

    const allAssignments = await db
      .select({
        id: schema.serviceTeamAssignments.id,
        serviceTeamId: schema.serviceTeamAssignments.serviceTeamId,
        functionRole: schema.serviceTeamAssignments.functionRole,
        confirmed: schema.serviceTeamAssignments.confirmed,
        person: {
          id: schema.persons.id,
          fullName: schema.persons.fullName,
          avatarUrl: schema.persons.avatarUrl,
          mobilePhone: schema.persons.mobilePhone,
        },
      })
      .from(schema.serviceTeamAssignments)
      .innerJoin(
        schema.persons,
        eq(schema.serviceTeamAssignments.personId, schema.persons.id),
      )
      .where(eq(schema.serviceTeamAssignments.eventId, eventId))
      .orderBy(asc(schema.persons.fullName));

    const byTeam = new Map<string, typeof allAssignments>();
    for (const a of allAssignments) {
      const arr = byTeam.get(a.serviceTeamId) ?? [];
      arr.push(a);
      byTeam.set(a.serviceTeamId, arr);
    }

    return teams.map((t) => ({
      ...t,
      members: byTeam.get(t.id) ?? [],
    }));
  },

  async addAssignment(
    db: Database,
    teamId: string,
    payload: AddAssignment,
  ) {
    const [team] = await db
      .select({ id: schema.serviceTeams.id })
      .from(schema.serviceTeams)
      .where(eq(schema.serviceTeams.id, teamId))
      .limit(1);
    if (!team) throw new ServiceTeamError('NOT_FOUND', 'Equipe não encontrada.');

    const [event] = await db
      .select({ id: schema.events.id })
      .from(schema.events)
      .where(eq(schema.events.id, payload.eventId))
      .limit(1);
    if (!event) {
      throw new ServiceTeamError('EVENT_NOT_FOUND', 'Evento não encontrado.');
    }

    const [person] = await db
      .select({ id: schema.persons.id })
      .from(schema.persons)
      .where(eq(schema.persons.id, payload.personId))
      .limit(1);
    if (!person) {
      throw new ServiceTeamError('PERSON_NOT_FOUND', 'Pessoa não encontrada.');
    }

    const [existing] = await db
      .select({ id: schema.serviceTeamAssignments.id })
      .from(schema.serviceTeamAssignments)
      .where(
        and(
          eq(schema.serviceTeamAssignments.serviceTeamId, teamId),
          eq(schema.serviceTeamAssignments.eventId, payload.eventId),
          eq(schema.serviceTeamAssignments.personId, payload.personId),
        ),
      )
      .limit(1);
    if (existing) {
      throw new ServiceTeamError(
        'ALREADY_ASSIGNED',
        'Pessoa já está nesta equipe deste evento.',
      );
    }

    const [created] = await db
      .insert(schema.serviceTeamAssignments)
      .values({
        serviceTeamId: teamId,
        eventId: payload.eventId,
        personId: payload.personId,
        functionRole: payload.functionRole,
        confirmed: payload.confirmed,
      })
      .returning();
    return created!;
  },

  async removeAssignment(
    db: Database,
    teamId: string,
    eventId: string,
    personId: string,
  ) {
    await db
      .delete(schema.serviceTeamAssignments)
      .where(
        and(
          eq(schema.serviceTeamAssignments.serviceTeamId, teamId),
          eq(schema.serviceTeamAssignments.eventId, eventId),
          eq(schema.serviceTeamAssignments.personId, personId),
        ),
      );
  },

  async getMyCurrent(db: Database, personId: string) {
    const [latest] = await db
      .select({
        assignment: schema.serviceTeamAssignments,
        team: schema.serviceTeams,
        event: schema.events,
      })
      .from(schema.serviceTeamAssignments)
      .innerJoin(
        schema.serviceTeams,
        eq(schema.serviceTeamAssignments.serviceTeamId, schema.serviceTeams.id),
      )
      .innerJoin(
        schema.events,
        eq(schema.serviceTeamAssignments.eventId, schema.events.id),
      )
      .where(eq(schema.serviceTeamAssignments.personId, personId))
      .orderBy(desc(schema.events.startDate))
      .limit(1);
    if (!latest) return null;
    return {
      assignment: latest.assignment,
      team: latest.team,
      event: {
        id: latest.event.id,
        name: latest.event.name,
        slug: latest.event.slug,
        startDate: latest.event.startDate,
        endDate: latest.event.endDate,
      },
    };
  },
};
