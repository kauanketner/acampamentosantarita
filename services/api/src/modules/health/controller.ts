import type { FastifyReply, FastifyRequest } from 'fastify';
import { healthUpsertSchema } from './schemas.ts';
import { healthService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const healthController = {
  async getMine(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const data = await healthService.getMine(req.server.db, req.user.personId);
    return data ?? null;
  },

  async upsertMine(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const parsed = healthUpsertSchema.parse(req.body);
    const data = await healthService.upsertMine(req.server.db, req.user.personId, parsed);
    return data;
  },

  getByPersonId: notImplemented,
};
