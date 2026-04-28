import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  addAssignmentSchema,
  createServiceTeamSchema,
  updateServiceTeamSchema,
} from './schemas.ts';
import { ServiceTeamError, serviceTeamsService } from './service.ts';

const ERROR_TO_STATUS: Record<ServiceTeamError['code'], number> = {
  NOT_FOUND: 404,
  EVENT_NOT_FOUND: 404,
  PERSON_NOT_FOUND: 404,
  ALREADY_ASSIGNED: 409,
};

function sendError(reply: FastifyReply, e: ServiceTeamError) {
  reply.code(ERROR_TO_STATUS[e.code] ?? 400).send({ error: e.code, message: e.message });
}

function requireAdmin(req: FastifyRequest, reply: FastifyReply): boolean {
  if (!req.user) {
    reply.code(401).send({ error: 'UNAUTHORIZED' });
    return false;
  }
  if (req.user.role === 'participante') {
    reply.code(403).send({ error: 'FORBIDDEN' });
    return false;
  }
  return true;
}

export const serviceTeamsController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await serviceTeamsService.listAll(req.server.db);
    return { items };
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createServiceTeamSchema.parse(req.body);
    const created = await serviceTeamsService.create(req.server.db, parsed);
    reply.code(201);
    return created;
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateServiceTeamSchema.parse(req.body);
    try {
      return await serviceTeamsService.update(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof ServiceTeamError) return sendError(reply, e);
      throw e;
    }
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await serviceTeamsService.delete(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof ServiceTeamError) return sendError(reply, e);
      throw e;
    }
  },

  async addAssignment(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = addAssignmentSchema.parse(req.body);
    try {
      const created = await serviceTeamsService.addAssignment(req.server.db, id, parsed);
      reply.code(201);
      return created;
    } catch (e) {
      if (e instanceof ServiceTeamError) return sendError(reply, e);
      throw e;
    }
  },

  async removeAssignment(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id, personId } = req.params as { id: string; personId: string };
    const eventId = (req.query as { eventId?: string })?.eventId;
    if (!eventId) {
      reply.code(400).send({ error: 'EVENT_ID_REQUIRED' });
      return;
    }
    await serviceTeamsService.removeAssignment(req.server.db, id, eventId, personId);
    reply.code(204);
  },

  async getMyCurrent(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    return serviceTeamsService.getMyCurrent(req.server.db, req.user.personId);
  },
};
