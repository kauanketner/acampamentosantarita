import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { persons } from './persons.ts';

export const sacramentEnum = pgEnum('sacrament', [
  'batismo',
  'eucaristia',
  'crisma',
  'matrimonio',
  'ordem',
  'uncao_enfermos',
  'confissao',
]);

export const faithProfiles = pgTable('faith_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .unique()
    .references(() => persons.id, { onDelete: 'cascade' }),
  religion: text('religion'),
  parish: text('parish'),
  groupName: text('group_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const receivedSacraments = pgTable('received_sacraments', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  sacrament: sacramentEnum('sacrament').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const faithProfilesRelations = relations(faithProfiles, ({ one }) => ({
  person: one(persons, {
    fields: [faithProfiles.personId],
    references: [persons.id],
  }),
}));

export const receivedSacramentsRelations = relations(receivedSacraments, ({ one }) => ({
  person: one(persons, {
    fields: [receivedSacraments.personId],
    references: [persons.id],
  }),
}));
