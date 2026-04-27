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
  listAlbums: notImplemented,
  getAlbum: notImplemented,
  listFaq: notImplemented,
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
