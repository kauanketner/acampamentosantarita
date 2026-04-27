import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { events } from './events.ts';
import { persons } from './persons.ts';

export const serviceTeams = pgTable('service_teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  icon: text('icon'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const serviceTeamAssignments = pgTable('service_team_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceTeamId: uuid('service_team_id')
    .notNull()
    .references(() => serviceTeams.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  // texto livre: "coordenador", "vice", "membro"
  functionRole: text('function_role').notNull().default('membro'),
  confirmed: boolean('confirmed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const serviceTeamsRelations = relations(serviceTeams, ({ many }) => ({
  assignments: many(serviceTeamAssignments),
}));

export const serviceTeamAssignmentsRelations = relations(serviceTeamAssignments, ({ one }) => ({
  serviceTeam: one(serviceTeams, {
    fields: [serviceTeamAssignments.serviceTeamId],
    references: [serviceTeams.id],
  }),
  event: one(events, {
    fields: [serviceTeamAssignments.eventId],
    references: [events.id],
  }),
  person: one(persons, {
    fields: [serviceTeamAssignments.personId],
    references: [persons.id],
  }),
}));
