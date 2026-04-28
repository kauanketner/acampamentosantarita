import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './auth.ts';
import { events } from './events.ts';
import { persons } from './persons.ts';

export const posItemCategoryEnum = pgEnum('pos_item_category', ['cantina', 'lojinha', 'outros']);

export const posAccountStatusEnum = pgEnum('pos_account_status', ['aberta', 'fechada', 'paga']);

export const posAccounts = pgTable('pos_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  status: posAccountStatusEnum('status').notNull().default('aberta'),
  openedAt: timestamp('opened_at', { withTimezone: true }).notNull().defaultNow(),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const posItems = pgTable('pos_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  sku: text('sku').unique(),
  category: posItemCategoryEnum('category').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  active: boolean('active').notNull().default(true),
  stock: integer('stock'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const posTransactions = pgTable('pos_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  posAccountId: uuid('pos_account_id')
    .notNull()
    .references(() => posAccounts.id, { onDelete: 'cascade' }),
  posItemId: uuid('pos_item_id').references(() => posItems.id, { onDelete: 'set null' }),
  // snapshot do nome/preço caso o item mude depois
  itemName: text('item_name').notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  recordedByUserId: uuid('recorded_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const posAccountsRelations = relations(posAccounts, ({ one, many }) => ({
  person: one(persons, {
    fields: [posAccounts.personId],
    references: [persons.id],
  }),
  event: one(events, {
    fields: [posAccounts.eventId],
    references: [events.id],
  }),
  transactions: many(posTransactions),
}));

export const posItemsRelations = relations(posItems, ({ many }) => ({
  transactions: many(posTransactions),
}));

export const posTransactionsRelations = relations(posTransactions, ({ one }) => ({
  account: one(posAccounts, {
    fields: [posTransactions.posAccountId],
    references: [posAccounts.id],
  }),
  item: one(posItems, {
    fields: [posTransactions.posItemId],
    references: [posItems.id],
  }),
  recordedBy: one(users, {
    fields: [posTransactions.recordedByUserId],
    references: [users.id],
  }),
}));
