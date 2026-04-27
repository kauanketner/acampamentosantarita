import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const registrationsController = {
  // POST /v1/registrations — cria inscrição: valida saúde recente, salva snapshot, gera invoice
  create: notImplemented,
  // GET /v1/registrations/me — minhas inscrições (todas)
  listMine: notImplemented,
  // GET /v1/registrations/:id
  getById: notImplemented,
  // POST /v1/registrations/:id/approve — admin aprova
  approve: notImplemented,
  // POST /v1/registrations/:id/reject — admin rejeita
  reject: notImplemented,
  // POST /v1/registrations/:id/cancel — pessoa cancela ou admin cancela
  cancel: notImplemented,
  // POST /v1/registrations/:id/mark-attended — admin marca presença no check-in
  markAttended: notImplemented,
  // GET /v1/registrations/event/:eventId — admin: todas inscrições do evento
  listByEvent: notImplemented,
};
