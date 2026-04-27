import type { FastifyReply, FastifyRequest } from 'fastify';
import { publicService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const publicController = {
  // Endpoints consumidos pelo apps/web (SSR/SSG do Next).
  // Apenas conteúdo publicado, sem autenticação.
  getPage: notImplemented,
  listPosts: notImplemented,
  getPost: notImplemented,
  listHomeBlocks: notImplemented,

  async listAlbums(req: FastifyRequest) {
    const albums = await publicService.listGalleryAlbums(req.server.db);
    return { items: albums };
  },

  async getAlbum(req: FastifyRequest, reply: FastifyReply) {
    const { slug } = req.params as { slug: string };
    const album = await publicService.getGalleryAlbum(req.server.db, slug);
    if (!album) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    return album;
  },

  async listFaq(req: FastifyRequest) {
    const items = await publicService.listFaq(req.server.db);
    return { items };
  },

  listShopProducts: notImplemented,

  async listUpcomingEvents(req: FastifyRequest) {
    const events = await publicService.listEvents(req.server.db);
    return { items: events };
  },

  async getEvent(req: FastifyRequest, reply: FastifyReply) {
    const { slug } = req.params as { slug: string };
    const event = await publicService.getEventBySlug(req.server.db, slug);
    if (!event) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    return event;
  },

  submitContact: notImplemented,
};
