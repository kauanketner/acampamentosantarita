import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const healthController = {
  // GET /v1/health/me — perfil de saúde da própria pessoa
  getMine: notImplemented,
  // PUT /v1/health/me — cria ou atualiza (upsert) e marca last_reviewed_at
  upsertMine: notImplemented,
  // GET /v1/health/persons/:id — admin/equipe vê o perfil de outra pessoa
  getByPersonId: notImplemented,
};
