import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const publicController = {
  // Endpoints consumidos pelo apps/web (SSR/SSG do Next).
  // Apenas conteúdo publicado, sem autenticação. Cache agressivo recomendado.
  getPage: notImplemented,
  listPosts: notImplemented,
  getPost: notImplemented,
  listHomeBlocks: notImplemented,
  listAlbums: notImplemented,
  getAlbum: notImplemented,
  listFaq: notImplemented,
  listShopProducts: notImplemented,
  listUpcomingEvents: notImplemented,
  getEvent: notImplemented,
  submitContact: notImplemented,
};
