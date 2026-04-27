import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const eventsController = {
  // GET /v1/events — admin: lista todos. Filtros por status/tipo/edição.
  list: notImplemented,
  // POST /v1/events
  create: notImplemented,
  // GET /v1/events/:id
  getById: notImplemented,
  // PATCH /v1/events/:id
  update: notImplemented,
  // DELETE /v1/events/:id — soft delete
  softDelete: notImplemented,
  // POST /v1/events/:id/duplicate — clona evento (perguntas customizadas, equipes etc.)
  duplicate: notImplemented,

  listRegistrations: notImplemented,
  listTribes: notImplemented,
  listServiceTeams: notImplemented,

  listCustomQuestions: notImplemented,
  addCustomQuestion: notImplemented,
  updateCustomQuestion: notImplemented,
  deleteCustomQuestion: notImplemented,
};
