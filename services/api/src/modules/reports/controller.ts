import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const reportsController = {
  // KPIs gerais: pessoas ativas, próximo evento, inadimplência, etc.
  dashboard: notImplemented,
  registrations: notImplemented,
  finance: notImplemented,
  // pessoas por evento, com cortes (campistas / equipistas / 1ª vez / veteranos)
  participantsByEvent: notImplemented,
  // distribuição de participações declaradas (1º a 13º acampamentos)
  legacyHistory: notImplemented,
};
