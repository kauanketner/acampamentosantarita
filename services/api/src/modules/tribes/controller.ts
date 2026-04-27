import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  addMemberSchema,
  createTribeSchema,
  updateTribeSchema,
} from './schemas.ts';
import { TribeError, tribesService } from './service.ts';

const ERROR_TO_STATUS: Record<TribeError['code'], number> = {
  EVENT_NOT_FOUND: 404,
  TRIBE_NOT_FOUND: 404,
  PERSON_NOT_FOUND: 404,
  ALREADY_MEMBER: 409,
  NOT_MEMBER: 404,
};

function sendError(reply: FastifyReply, e: TribeError) {
  reply
    .code(ERROR_TO_STATUS[e.code] ?? 400)
    .send({ error: e.code, message: e.message });
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

export const tribesController = {
  async create(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createTribeSchema.parse(req.body);
    try {
      const tribe = await tribesService.create(req.server.db, parsed);
      reply.code(201);
      return tribe;
    } catch (e) {
      if (e instanceof TribeError) return sendError(reply, e);
      throw e;
    }
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const tribe = await tribesService.getById(req.server.db, id);
    if (!tribe) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    return tribe;
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateTribeSchema.parse(req.body);
    try {
      return await tribesService.update(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof TribeError) return sendError(reply, e);
      throw e;
    }
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await tribesService.delete(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof TribeError) return sendError(reply, e);
      throw e;
    }
  },

  async addMember(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = addMemberSchema.parse(req.body);
    try {
      const member = await tribesService.addMember(req.server.db, id, parsed);
      reply.code(201);
      return member;
    } catch (e) {
      if (e instanceof TribeError) return sendError(reply, e);
      throw e;
    }
  },

  async removeMember(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id, personId } = req.params as { id: string; personId: string };
    try {
      await tribesService.removeMember(req.server.db, id, personId);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof TribeError) return sendError(reply, e);
      throw e;
    }
  },

  async revealForEvent(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { eventId } = req.params as { eventId: string };
    return tribesService.revealForEvent(req.server.db, eventId);
  },

  // PWA — restrito ao usuário logado.
  async getMyCurrent(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user?.personId) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const result = await tribesService.getCurrentForPerson(
      req.server.db,
      req.user.personId,
    );
    return result;
  },
};
