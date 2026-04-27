import type { FastifyReply, FastifyRequest } from 'fastify';
import { eventsService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const eventsController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user || req.user.role === 'participante') {
      reply.code(403).send({ error: 'FORBIDDEN' });
      return;
    }
    const items = await eventsService.listAll(req.server.db);
    return { items };
  },

  create: notImplemented,

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const event = await eventsService.getById(req.server.db, id);
    if (!event) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    return event;
  },

  update: notImplemented,
  softDelete: notImplemented,
  duplicate: notImplemented,

  listRegistrations: notImplemented,
  listTribes: notImplemented,
  listServiceTeams: notImplemented,

  async listCustomQuestions(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const event = await eventsService.getById(req.server.db, id);
    if (!event) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    const questions = await eventsService.listCustomQuestions(req.server.db, id);
    return { items: questions };
  },

  addCustomQuestion: notImplemented,
  updateCustomQuestion: notImplemented,
  deleteCustomQuestion: notImplemented,
};
