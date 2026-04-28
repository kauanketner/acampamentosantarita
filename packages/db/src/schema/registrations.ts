import { relations } from 'drizzle-orm';
import {
  boolean,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './auth.ts';
import { events, eventCustomQuestions } from './events.ts';
import { persons } from './persons.ts';
import { serviceTeams } from './service-teams.ts';
import { tribes } from './tribes.ts';

export const participationRoleEnum = pgEnum('participation_role', [
  'campista',
  'equipista',
  'lider',
]);

export const registrationRoleIntentEnum = pgEnum('registration_role_intent', [
  'campista',
  'equipista',
]);

export const registrationStatusEnum = pgEnum('registration_status', [
  'pendente',
  'aprovada',
  'rejeitada',
  'em_espera',
  'confirmada',
  'cancelada',
]);

export const registrationPaymentStatusEnum = pgEnum('registration_payment_status', [
  'isento',
  'pendente',
  'pago',
  'parcial',
  'reembolsado',
]);

export const registrations = pgTable('registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  roleIntent: registrationRoleIntentEnum('role_intent').notNull(),
  status: registrationStatusEnum('status').notNull().default('pendente'),
  // tribo só revelada ao participante após o final do evento
  tribeId: uuid('tribe_id').references(() => tribes.id, { onDelete: 'set null' }),
  serviceTeamId: uuid('service_team_id').references(() => serviceTeams.id, {
    onDelete: 'set null',
  }),
  functionRole: text('function_role'),
  paymentStatus: registrationPaymentStatusEnum('payment_status').notNull().default('pendente'),
  priceAmount: numeric('price_amount', { precision: 10, scale: 2 }),
  registeredAt: timestamp('registered_at', { withTimezone: true }).notNull().defaultNow(),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  approvedByUserId: uuid('approved_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  cancellationReason: text('cancellation_reason'),
  attended: boolean('attended').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const registrationAnswers = pgTable('registration_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  registrationId: uuid('registration_id')
    .notNull()
    .references(() => registrations.id, { onDelete: 'cascade' }),
  customQuestionId: uuid('custom_question_id')
    .notNull()
    .references(() => eventCustomQuestions.id, { onDelete: 'cascade' }),
  // text para respostas simples, jsonb para multi-select / objetos
  answer: jsonb('answer'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Snapshot do health_profile no momento da inscrição (prova de revisão).
export const registrationHealthSnapshots = pgTable('registration_health_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  registrationId: uuid('registration_id')
    .notNull()
    .unique()
    .references(() => registrations.id, { onDelete: 'cascade' }),
  healthProfileSnapshot: jsonb('health_profile_snapshot').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const registrationsRelations = relations(registrations, ({ one, many }) => ({
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
  person: one(persons, {
    fields: [registrations.personId],
    references: [persons.id],
  }),
  tribe: one(tribes, {
    fields: [registrations.tribeId],
    references: [tribes.id],
  }),
  serviceTeam: one(serviceTeams, {
    fields: [registrations.serviceTeamId],
    references: [serviceTeams.id],
  }),
  approvedBy: one(users, {
    fields: [registrations.approvedByUserId],
    references: [users.id],
  }),
  answers: many(registrationAnswers),
  healthSnapshot: one(registrationHealthSnapshots, {
    fields: [registrations.id],
    references: [registrationHealthSnapshots.registrationId],
  }),
}));

export const registrationAnswersRelations = relations(registrationAnswers, ({ one }) => ({
  registration: one(registrations, {
    fields: [registrationAnswers.registrationId],
    references: [registrations.id],
  }),
  customQuestion: one(eventCustomQuestions, {
    fields: [registrationAnswers.customQuestionId],
    references: [eventCustomQuestions.id],
  }),
}));

export const registrationHealthSnapshotsRelations = relations(
  registrationHealthSnapshots,
  ({ one }) => ({
    registration: one(registrations, {
      fields: [registrationHealthSnapshots.registrationId],
      references: [registrations.id],
    }),
  }),
);
