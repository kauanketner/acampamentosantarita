import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { persons } from './persons.ts';

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'equipe_acampamento',
  'tesouraria',
  'comunicacao',
  'participante',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  phone: text('phone').unique(),
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').notNull().default('participante'),
  personId: uuid('person_id').references(() => persons.id, { onDelete: 'set null' }),
  emailVerified: boolean('email_verified').notNull().default(false),
  active: boolean('active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Códigos OTP enviados via WhatsApp para login/registro.
// Expiram em 10 minutos. Após 5 tentativas falhas, ficam invalidados.
export const authCodes = pgTable('auth_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone').notNull(),
  code: text('code').notNull(),
  // 'login' = código de acesso para usuário existente
  // 'register' = código gerado durante cadastro
  purpose: text('purpose').notNull().default('login'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  attempts: integer('attempts').notNull().default(0),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  person: one(persons, {
    fields: [users.personId],
    references: [persons.id],
  }),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
