import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const serviceTeamsController = {
  // GET /v1/service-teams — catálogo de equipes (cozinha, logística, ...)
  list: notImplemented,
  create: notImplemented,
  update: notImplemented,
  delete: notImplemented,
  // POST /v1/service-teams/:id/assignments — vincula pessoa a equipe num evento específico
  addAssignment: notImplemented,
  removeAssignment: notImplemented,
  // GET /v1/service-teams/me/current — equipe que sirvo no próximo evento ou em andamento
  getMyCurrent: notImplemented,
};
