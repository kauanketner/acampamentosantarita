import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const shopController = {
  // CRUD do catálogo da lojinha do site público (não há checkout aqui).
  list: notImplemented,
  create: notImplemented,
  update: notImplemented,
  delete: notImplemented,
};
