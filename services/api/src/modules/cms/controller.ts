import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  addGalleryPhotoSchema,
  createFaqItemSchema,
  createGalleryAlbumSchema,
  createHomeBlockSchema,
  createPostSchema,
  updateFaqItemSchema,
  updateGalleryAlbumSchema,
  updateHomeBlockSchema,
  updatePostSchema,
} from './schemas.ts';
import { CmsError, cmsService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

const ERROR_TO_STATUS: Record<CmsError['code'], number> = {
  NOT_FOUND: 404,
  SLUG_TAKEN: 409,
};

function sendError(reply: FastifyReply, e: CmsError) {
  reply.code(ERROR_TO_STATUS[e.code] ?? 400).send({ error: e.code, message: e.message });
}

function requireAdmin(req: FastifyRequest, reply: FastifyReply): boolean {
  if (!req.user) {
    reply.code(401).send({ error: 'UNAUTHORIZED' });
    return false;
  }
  if (req.user.role === 'participante') {
    reply.code(403).send({ error: 'FORBIDDEN' });
    return false;
  }
  return true;
}

export const cmsController = {
  // pages — fora do escopo desta fase
  listPages: notImplemented,
  createPage: notImplemented,
  updatePage: notImplemented,
  deletePage: notImplemented,

  // ===== Posts =====
  async listPosts(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await cmsService.listPostsAll(req.server.db);
    return { items };
  },
  async createPost(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createPostSchema.parse(req.body);
    try {
      const created = await cmsService.createPost(req.server.db, parsed, req.user!.id);
      reply.code(201);
      return created;
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },
  async updatePost(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updatePostSchema.parse(req.body);
    try {
      return await cmsService.updatePost(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },
  async deletePost(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    await cmsService.deletePost(req.server.db, id);
    reply.code(204);
  },

  // ===== Gallery =====
  async listAlbums(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await cmsService.listAlbumsAll(req.server.db);
    return { items };
  },

  async createAlbum(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createGalleryAlbumSchema.parse(req.body);
    try {
      const album = await cmsService.createAlbum(req.server.db, parsed);
      reply.code(201);
      return album;
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },

  async updateAlbum(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateGalleryAlbumSchema.parse(req.body);
    try {
      return await cmsService.updateAlbum(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },

  async deleteAlbum(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await cmsService.deleteAlbum(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },

  async addPhoto(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = addGalleryPhotoSchema.parse(req.body);
    try {
      const photo = await cmsService.addPhoto(req.server.db, id, parsed);
      reply.code(201);
      return photo;
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },

  async deletePhoto(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await cmsService.deletePhoto(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },

  // ===== Home blocks =====
  async listHomeBlocks(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await cmsService.listHomeBlocksAll(req.server.db);
    return { items };
  },
  async createHomeBlock(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createHomeBlockSchema.parse(req.body);
    const created = await cmsService.createHomeBlock(req.server.db, parsed);
    reply.code(201);
    return created;
  },
  async updateHomeBlock(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateHomeBlockSchema.parse(req.body);
    try {
      return await cmsService.updateHomeBlock(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },
  async deleteHomeBlock(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    await cmsService.deleteHomeBlock(req.server.db, id);
    reply.code(204);
  },

  // ===== FAQ =====
  async listFaq(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await cmsService.listFaqAll(req.server.db);
    return { items };
  },

  async createFaqItem(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createFaqItemSchema.parse(req.body);
    const item = await cmsService.createFaq(req.server.db, parsed);
    reply.code(201);
    return item;
  },

  async updateFaqItem(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateFaqItemSchema.parse(req.body);
    try {
      return await cmsService.updateFaq(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },

  async deleteFaqItem(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await cmsService.deleteFaq(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof CmsError) return sendError(reply, e);
      throw e;
    }
  },
};
