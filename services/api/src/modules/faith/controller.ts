import type { FastifyReply, FastifyRequest } from 'fastify';
import { faithUpsertSchema } from './schemas.ts';
import { faithService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const faithController = {
  async getMine(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const data = await faithService.getMine(req.server.db, req.user.personId);
    return data;
  },

  async upsertMine(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const parsed = faithUpsertSchema.parse(req.body);
    const data = await faithService.upsertMine(req.server.db, req.user.personId, parsed);
    return data;
  },

  getByPersonId: notImplemented,
};
