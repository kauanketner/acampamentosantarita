import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const campHistoryController = {
  // GET /v1/camp-history/me — todas as participações declaradas (legado) + automáticas
  getMine: notImplemented,
  // POST /v1/camp-history/me — declara uma participação legada (1º a 13º acampamentos)
  addLegacy: notImplemented,
  // DELETE /v1/camp-history/me/:id — remove participação legada (só is_legacy=true)
  removeLegacy: notImplemented,
  // GET /v1/camp-history/persons/:id — admin
  getByPersonId: notImplemented,
};
