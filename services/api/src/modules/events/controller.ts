import type { FastifyReply, FastifyRequest } from 'fastify';
import { registrationsService } from '../registrations/service.ts';
import { tribesService } from '../tribes/service.ts';
import {
  createCustomQuestionSchema,
  createEventSchema,
  updateCustomQuestionSchema,
  updateEventSchema,
} from './schemas.ts';
import { EventError, eventsService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

const ERROR_TO_STATUS: Record<EventError['code'], number> = {
  NOT_FOUND: 404,
  SLUG_TAKEN: 409,
  IN_USE: 409,
};

function sendError(reply: FastifyReply, e: EventError) {
  reply.code(ERROR_TO_STATUS[e.code] ?? 400).send({
    error: e.code,
    message: e.message,
  });
}

function requireAdmin(req: FastifyRequest, reply: FastifyReply): boolean {
  if (!req.user || req.user.role === 'participante') {
    reply.code(req.user ? 403 : 401).send({
      error: req.user ? 'FORBIDDEN' : 'UNAUTHORIZED',
    });
    return false;
  }
  return true;
}

export const eventsController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await eventsService.listAll(req.server.db);
    return { items };
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createEventSchema.parse(req.body);
    try {
      const event = await eventsService.create(req.server.db, parsed);
      reply.code(201);
      return event;
    } catch (e) {
      if (e instanceof EventError) return sendError(reply, e);
      throw e;
    }
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const event = await eventsService.getById(req.server.db, id);
    if (!event) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    return event;
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateEventSchema.parse(req.body);
    try {
      return await eventsService.update(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof EventError) return sendError(reply, e);
      throw e;
    }
  },

  async softDelete(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await eventsService.softDelete(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof EventError) return sendError(reply, e);
      throw e;
    }
  },

  duplicate: notImplemented,

  async listRegistrations(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const items = await registrationsService.listByEvent(req.server.db, id);
    return { items };
  },

  async listTribes(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const items = await tribesService.listByEvent(req.server.db, id);
    return { items };
  },

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

  async addCustomQuestion(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = createCustomQuestionSchema.parse(req.body);
    try {
      const created = await eventsService.createCustomQuestion(
        req.server.db,
        id,
        parsed,
      );
      reply.code(201);
      return created;
    } catch (e) {
      if (e instanceof EventError) return sendError(reply, e);
      throw e;
    }
  },

  async updateCustomQuestion(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateCustomQuestionSchema.parse(req.body);
    try {
      return await eventsService.updateCustomQuestion(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof EventError) return sendError(reply, e);
      throw e;
    }
  },

  async deleteCustomQuestion(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    await eventsService.deleteCustomQuestion(req.server.db, id);
    reply.code(204);
  },
};
