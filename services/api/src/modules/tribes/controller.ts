import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const tribesController = {
  // POST /v1/tribes — admin cria uma tribo num evento
  create: notImplemented,
  // GET /v1/tribes/:id
  getById: notImplemented,
  // PATCH /v1/tribes/:id
  update: notImplemented,
  // DELETE /v1/tribes/:id
  delete: notImplemented,
  // POST /v1/tribes/:id/members — adiciona pessoa (líder/vice/campista)
  addMember: notImplemented,
  // DELETE /v1/tribes/:id/members/:personId
  removeMember: notImplemented,
  // POST /v1/tribes/event/:eventId/reveal-tribes — libera visualização (is_revealed_to_member=true)
  revealForEvent: notImplemented,
  // GET /v1/tribes/me/current — PWA: só retorna se evento finalizado E revelado
  getMyCurrent: notImplemented,
};
