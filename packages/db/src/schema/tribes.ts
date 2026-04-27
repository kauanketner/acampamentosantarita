import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { events } from './events.ts';
import { persons } from './persons.ts';

export const tribeMemberRoleEnum = pgEnum('tribe_member_role', ['lider', 'vice_lider', 'campista']);

export const tribes = pgTable('tribes', {
  id: uuid('id').primaryKey().defaultRandom(),
  // tribos pertencem a um acampamento numerado específico
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color'),
  motto: text('motto'),
  description: text('description'),
  photoUrl: text('photo_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tribeMembers = pgTable('tribe_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  tribeId: uuid('tribe_id')
    .notNull()
    .references(() => tribes.id, { onDelete: 'cascade' }),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  role: tribeMemberRoleEnum('role').notNull().default('campista'),
  // só vira true quando admin libera revelação ao final do evento
  isRevealedToMember: boolean('is_revealed_to_member').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tribesRelations = relations(tribes, ({ one, many }) => ({
  event: one(events, {
    fields: [tribes.eventId],
    references: [events.id],
  }),
  members: many(tribeMembers),
}));

export const tribeMembersRelations = relations(tribeMembers, ({ one }) => ({
  tribe: one(tribes, {
    fields: [tribeMembers.tribeId],
    references: [tribes.id],
  }),
  person: one(persons, {
    fields: [tribeMembers.personId],
    references: [persons.id],
  }),
}));
