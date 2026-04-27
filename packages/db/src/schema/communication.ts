import { relations } from 'drizzle-orm';
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './auth.ts';
import { events } from './events.ts';
import { persons } from './persons.ts';

export const announcementAudienceEnum = pgEnum('announcement_audience', [
  'todos',
  'participantes_evento',
  'equipistas',
  'tribo_x',
  'equipe_x',
]);

export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  // null = aviso geral; preenchido = vinculado a um evento específico
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  imageUrl: text('image_url'),
  targetAudience: announcementAudienceEnum('target_audience').notNull().default('todos'),
  // id da tribo/equipe/evento quando audience é tribo_x / equipe_x
  targetId: uuid('target_id'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  publishedByUserId: uuid('published_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  sendPush: boolean('send_push').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  body: text('body'),
  data: jsonb('data'),
  readAt: timestamp('read_at', { withTimezone: true }),
  sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull(),
  // { p256dh, auth }
  keys: jsonb('keys').notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const emailLog = pgTable('email_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  to: text('to').notNull(),
  subject: text('subject').notNull(),
  template: text('template'),
  status: text('status').notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
  error: text('error'),
});

export const announcementsRelations = relations(announcements, ({ one }) => ({
  event: one(events, {
    fields: [announcements.eventId],
    references: [events.id],
  }),
  publishedBy: one(users, {
    fields: [announcements.publishedByUserId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  person: one(persons, {
    fields: [notifications.personId],
    references: [persons.id],
  }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  person: one(persons, {
    fields: [pushSubscriptions.personId],
    references: [persons.id],
  }),
}));
