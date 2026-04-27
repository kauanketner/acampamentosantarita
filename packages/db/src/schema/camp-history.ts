import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { persons } from './persons.ts';
import { participationRoleEnum } from './registrations.ts';
import { serviceTeams } from './service-teams.ts';
import { tribes } from './tribes.ts';

// Histórico legado: pessoas que participaram dos acampamentos 1º a 13º
// declaram manualmente. Para acampamentos futuros (14º+), o sistema cria
// automaticamente quando a inscrição é confirmada.
export const campParticipations = pgTable('camp_participations', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  // 1, 2, 3, ... 14
  campEdition: integer('camp_edition').notNull(),
  campYear: integer('camp_year'),
  role: participationRoleEnum('role').notNull(),
  // só preenchido quando a tribo já existe no sistema
  tribeId: uuid('tribe_id').references(() => tribes.id, { onDelete: 'set null' }),
  // texto livre para tribos legadas que ainda não foram cadastradas
  tribeNameLegacy: text('tribe_name_legacy'),
  serviceTeamId: uuid('service_team_id').references(() => serviceTeams.id, {
    onDelete: 'set null',
  }),
  // texto livre: "coordenador", "vice", "membro" etc.
  functionRole: text('function_role'),
  // true = registrado manualmente pelo usuário (legado), false = gerado pelo sistema
  isLegacy: boolean('is_legacy').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const campParticipationsRelations = relations(campParticipations, ({ one }) => ({
  person: one(persons, {
    fields: [campParticipations.personId],
    references: [persons.id],
  }),
  tribe: one(tribes, {
    fields: [campParticipations.tribeId],
    references: [tribes.id],
  }),
  serviceTeam: one(serviceTeams, {
    fields: [campParticipations.serviceTeamId],
    references: [serviceTeams.id],
  }),
}));
