import type { FastifyReply, FastifyRequest } from 'fastify';
import { tribesService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const tribesController = {
  create: notImplemented,
  getById: notImplemented,
  update: notImplemented,
  delete: notImplemented,
  addMember: notImplemented,
  removeMember: notImplemented,
  revealForEvent: notImplemented,

  // GET /v1/tribes/me/current — PWA: estado da tribo do usuário no evento mais
  // recente em que ele é membro. Quando admin ainda não liberou, devolve só
  // o evento de espera (revealed=false).
  async getMyCurrent(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const result = await tribesService.getCurrentForPerson(
      req.server.db,
      req.user.personId,
    );
    return result; // pode ser null
  },
};
