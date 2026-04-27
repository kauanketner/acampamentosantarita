import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const faithController = {
  // GET /v1/faith/me — vida de fé da própria pessoa (perfil + sacramentos)
  getMine: notImplemented,
  // PUT /v1/faith/me — upsert de faith_profile + sincroniza sacramentos
  upsertMine: notImplemented,
  // GET /v1/faith/persons/:id
  getByPersonId: notImplemented,
};
