import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const genderEnum = pgEnum('gender', ['masculino', 'feminino']);

export const maritalStatusEnum = pgEnum('marital_status', [
  'solteiro',
  'casado',
  'divorciado',
  'viuvo',
  'uniao_estavel',
]);

export const shirtSizeEnum = pgEnum('shirt_size', ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']);

export const persons = pgTable('persons', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Passo 1 — Dados pessoais
  fullName: text('full_name').notNull(),
  gender: genderEnum('gender'),
  birthDate: date('birth_date'),
  cpf: text('cpf').unique(),
  maritalStatus: maritalStatusEnum('marital_status'),
  heightCm: integer('height_cm'),
  weightKg: numeric('weight_kg', { precision: 5, scale: 2 }),
  shirtSize: shirtSizeEnum('shirt_size'),
  avatarUrl: text('avatar_url'),
  // Passo 2 — Endereço
  zipCode: text('zip_code'),
  street: text('street'),
  neighborhood: text('neighborhood'),
  city: text('city'),
  state: text('state'),
  addressNumber: text('address_number'),
  addressComplement: text('address_complement'),
  mobilePhone: text('mobile_phone'),
  // Meta
  profileCompletedAt: timestamp('profile_completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const emergencyContacts = pgTable('emergency_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  relationship: text('relationship').notNull(),
  phone: text('phone').notNull(),
  // ordem de exibição (1º, 2º, 3º contato)
  order: integer('order').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const personsRelations = relations(persons, ({ many }) => ({
  emergencyContacts: many(emergencyContacts),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  person: one(persons, {
    fields: [emergencyContacts.personId],
    references: [persons.id],
  }),
}));
