import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Catálogo da lojinha do site público.
// O fluxo é: visitor clica → abre WhatsApp com mensagem pré-formatada.
// Não há checkout, carrinho ou estoque conectado.
export const shopProducts = pgTable('shop_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  // [{ url, alt }, ...]
  photos: jsonb('photos'),
  category: text('category'),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  // {{nome}}, {{preco}} etc. — mensagem que o WhatsApp abre pré-preenchida
  whatsappMessageTemplate: text('whatsapp_message_template'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
