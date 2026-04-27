import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const personsController = {
  // GET /v1/persons — lista com filtros (cidade, idade, gênero, primeira_vez, etc.)
  list: notImplemented,
  // POST /v1/persons — admin cria pessoa manualmente
  create: notImplemented,
  // GET /v1/persons/:id
  getById: notImplemented,
  // PATCH /v1/persons/:id — atualiza dados pessoais/endereço
  update: notImplemented,
  // DELETE /v1/persons/:id — soft delete
  softDelete: notImplemented,
  // GET /v1/persons/:id/full-profile — pessoa + saúde + fé + contatos + histórico
  fullProfile: notImplemented,
  // PATCH /v1/persons/:id/avatar — upload R2 + atualiza avatar_url
  updateAvatar: notImplemented,
};
