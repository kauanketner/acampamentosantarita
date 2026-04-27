import { relations } from 'drizzle-orm';
import {
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './auth.ts';
import { persons } from './persons.ts';

export const invoiceTypeEnum = pgEnum('invoice_type', [
  'registration',
  'pos',
  'shop',
  'other',
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'pendente',
  'pago',
  'parcial',
  'vencido',
  'cancelado',
  'reembolsado',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'pix',
  'cartao',
  'boleto',
  'dinheiro',
  'transferencia',
]);

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  type: invoiceTypeEnum('type').notNull(),
  // referência polimórfica: id da inscrição / pos_account / shop / outro
  referenceId: uuid('reference_id'),
  referenceType: text('reference_type'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  status: invoiceStatusEnum('status').notNull().default('pendente'),
  description: text('description'),
  asaasPaymentId: text('asaas_payment_id'),
  asaasInvoiceUrl: text('asaas_invoice_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id')
    .notNull()
    .references(() => invoices.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }).notNull().defaultNow(),
  method: paymentMethodEnum('method').notNull(),
  // admin que registrou pagamento em dinheiro
  recordedByUserId: uuid('recorded_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  asaasTransactionId: text('asaas_transaction_id'),
  receiptUrl: text('receipt_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const refunds = pgTable('refunds', {
  id: uuid('id').primaryKey().defaultRandom(),
  paymentId: uuid('payment_id')
    .notNull()
    .references(() => payments.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason'),
  refundedAt: timestamp('refunded_at', { withTimezone: true }).notNull().defaultNow(),
  refundedByUserId: uuid('refunded_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
});

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  person: one(persons, {
    fields: [invoices.personId],
    references: [persons.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
  recordedBy: one(users, {
    fields: [payments.recordedByUserId],
    references: [users.id],
  }),
  refunds: many(refunds),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
  refundedBy: one(users, {
    fields: [refunds.refundedByUserId],
    references: [users.id],
  }),
}));
