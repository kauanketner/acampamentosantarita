import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './auth.ts';
import { events } from './events.ts';

export const homeBlockTypeEnum = pgEnum('home_block_type', [
  'hero',
  'call_to_action',
  'text',
  'gallery',
  'testimonial',
  'numbers',
]);

export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  // conteúdo em blocos: [{ type, props, children }, ...]
  content: jsonb('content'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  published: boolean('published').notNull().default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  coverUrl: text('cover_url'),
  authorUserId: uuid('author_user_id').references(() => users.id, { onDelete: 'set null' }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  // ["espiritualidade", "comunidade"]
  tags: jsonb('tags'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const galleryAlbums = pgTable('gallery_albums', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  coverUrl: text('cover_url'),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
  published: boolean('published').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const galleryPhotos = pgTable('gallery_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  albumId: uuid('album_id')
    .notNull()
    .references(() => galleryAlbums.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const homeBlocks = pgTable('home_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: homeBlockTypeEnum('type').notNull(),
  // dados do bloco — varia por tipo
  content: jsonb('content').notNull(),
  order: integer('order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const faqItems = pgTable('faq_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category'),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorUserId],
    references: [users.id],
  }),
}));

export const galleryAlbumsRelations = relations(galleryAlbums, ({ one, many }) => ({
  event: one(events, {
    fields: [galleryAlbums.eventId],
    references: [events.id],
  }),
  photos: many(galleryPhotos),
}));

export const galleryPhotosRelations = relations(galleryPhotos, ({ one }) => ({
  album: one(galleryAlbums, {
    fields: [galleryPhotos.albumId],
    references: [galleryAlbums.id],
  }),
}));
