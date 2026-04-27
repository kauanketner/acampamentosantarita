import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const eventTypeEnum = pgEnum('event_type', [
  'acampamento',
  'retiro',
  'encontro',
  'formacao',
  'outro',
]);

export const eventStatusEnum = pgEnum('event_status', [
  'rascunho',
  'inscricoes_abertas',
  'inscricoes_fechadas',
  'em_andamento',
  'finalizado',
  'cancelado',
]);

export const customQuestionTypeEnum = pgEnum('custom_question_type', [
  'text',
  'textarea',
  'select',
  'multi_select',
  'bool',
  'number',
  'date',
]);

export const customQuestionAudienceEnum = pgEnum('custom_question_audience', [
  'campista',
  'equipista',
  'ambos',
]);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: eventTypeEnum('type').notNull(),
  // só preenchido para acampamentos numerados (1º, 2º, ... 14º)
  editionNumber: integer('edition_number'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  location: text('location'),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  status: eventStatusEnum('status').notNull().default('rascunho'),
  maxParticipants: integer('max_participants'),
  // só acampamentos numerados aceitam alguém pela primeira vez
  allowFirstTimer: boolean('allow_first_timer').notNull().default(false),
  isPaid: boolean('is_paid').notNull().default(true),
  priceCampista: numeric('price_campista', { precision: 10, scale: 2 }),
  priceEquipista: numeric('price_equipista', { precision: 10, scale: 2 }),
  registrationDeadline: timestamp('registration_deadline', { withTimezone: true }),
  allowRegistrationViaApp: boolean('allow_registration_via_app').notNull().default(true),
  allowRegistrationViaSite: boolean('allow_registration_via_site').notNull().default(false),
  requiresAdminApproval: boolean('requires_admin_approval').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const eventCustomQuestions = pgTable('event_custom_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  type: customQuestionTypeEnum('type').notNull(),
  // opções para select/multi_select: { options: [{ value, label }] }
  options: jsonb('options'),
  required: boolean('required').notNull().default(false),
  order: integer('order').notNull().default(0),
  appliesTo: customQuestionAudienceEnum('applies_to').notNull().default('ambos'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const eventsRelations = relations(events, ({ many }) => ({
  customQuestions: many(eventCustomQuestions),
}));

export const eventCustomQuestionsRelations = relations(eventCustomQuestions, ({ one }) => ({
  event: one(events, {
    fields: [eventCustomQuestions.eventId],
    references: [events.id],
  }),
}));
