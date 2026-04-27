import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const cmsController = {
  // pages
  listPages: notImplemented,
  createPage: notImplemented,
  updatePage: notImplemented,
  deletePage: notImplemented,
  // posts (blog)
  listPosts: notImplemented,
  createPost: notImplemented,
  updatePost: notImplemented,
  deletePost: notImplemented,
  // gallery
  listAlbums: notImplemented,
  createAlbum: notImplemented,
  updateAlbum: notImplemented,
  deleteAlbum: notImplemented,
  addPhoto: notImplemented,
  deletePhoto: notImplemented,
  // home blocks (blocos da home do site público)
  listHomeBlocks: notImplemented,
  createHomeBlock: notImplemented,
  updateHomeBlock: notImplemented,
  deleteHomeBlock: notImplemented,
  // faq
  listFaq: notImplemented,
  createFaqItem: notImplemented,
  updateFaqItem: notImplemented,
  deleteFaqItem: notImplemented,
};
