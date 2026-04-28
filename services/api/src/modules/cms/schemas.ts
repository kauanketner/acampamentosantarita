import { z } from 'zod';

const optionalText = z
  .union([z.string(), z.null(), z.literal('')])
  .transform((v) => (v === '' || v == null ? null : v));

const optionalUrl = z
  .union([z.string().url(), z.null(), z.literal('')])
  .transform((v) => (v === '' || v == null ? null : v));

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ===== FAQ =====

export const faqItemBaseSchema = z
  .object({
    question: z.string().min(2).max(500),
    answer: z.string().min(2).max(5000),
    category: optionalText.optional(),
    sortOrder: z.number().int().min(0).default(0),
    published: z.boolean().default(true),
  })
  .strict();

export const createFaqItemSchema = faqItemBaseSchema;
export const updateFaqItemSchema = faqItemBaseSchema.partial();

// ===== Gallery =====

export const galleryAlbumBaseSchema = z
  .object({
    name: z.string().min(2).max(180),
    slug: z.string().regex(slugRegex).max(180),
    description: optionalText.optional(),
    coverUrl: optionalUrl.optional(),
    eventId: z.string().uuid().nullable().optional(),
    published: z.boolean().default(false),
    sortOrder: z.number().int().min(0).default(0),
  })
  .strict();

export const createGalleryAlbumSchema = galleryAlbumBaseSchema;
export const updateGalleryAlbumSchema = galleryAlbumBaseSchema.partial();

export const addGalleryPhotoSchema = z
  .object({
    imageUrl: z.string().url(),
    caption: optionalText.optional(),
    sortOrder: z.number().int().min(0).default(0),
  })
  .strict();

// ===== Posts (blog) =====

export const postBaseSchema = z
  .object({
    slug: z.string().regex(slugRegex).max(180),
    title: z.string().min(2).max(200),
    excerpt: optionalText.optional(),
    content: optionalText.optional(),
    coverUrl: optionalUrl.optional(),
    tags: z.array(z.string().min(1)).default([]),
    publish: z.boolean().default(false),
  })
  .strict();

export const createPostSchema = postBaseSchema;
export const updatePostSchema = postBaseSchema.partial();

// ===== Home blocks =====

export const homeBlockTypeSchema = z.enum([
  'hero',
  'call_to_action',
  'text',
  'gallery',
  'testimonial',
  'numbers',
]);

export const homeBlockBaseSchema = z
  .object({
    type: homeBlockTypeSchema,
    content: z.record(z.string(), z.unknown()),
    order: z.number().int().min(0).default(0),
    active: z.boolean().default(true),
  })
  .strict();

export const createHomeBlockSchema = homeBlockBaseSchema;
export const updateHomeBlockSchema = homeBlockBaseSchema.partial();

export type CreateFaqItem = z.infer<typeof createFaqItemSchema>;
export type UpdateFaqItem = z.infer<typeof updateFaqItemSchema>;
export type CreateGalleryAlbum = z.infer<typeof createGalleryAlbumSchema>;
export type UpdateGalleryAlbum = z.infer<typeof updateGalleryAlbumSchema>;
export type AddGalleryPhoto = z.infer<typeof addGalleryPhotoSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type CreateHomeBlock = z.infer<typeof createHomeBlockSchema>;
export type UpdateHomeBlock = z.infer<typeof updateHomeBlockSchema>;
