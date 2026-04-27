import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  adminCancelRegistrationSchema,
  cancelRegistrationSchema,
  createRegistrationSchema,
  rejectRegistrationSchema,
} from './schemas.ts';
import { RegistrationError, registrationsService } from './service.ts';

const ERROR_TO_STATUS: Record<RegistrationError['code'], number> = {
  EVENT_NOT_FOUND: 404,
  EVENT_CLOSED: 400,
  PERSON_NOT_FOUND: 404,
  ALREADY_REGISTERED: 409,
  FIRST_TIMER_NOT_ALLOWED: 400,
  HEALTH_PROFILE_REQUIRED: 400,
  NOT_FOUND: 404,
  NOT_OWNED: 403,
  INVALID_CANCEL: 400,
  INVALID_TRANSITION: 400,
};

function sendError(reply: FastifyReply, e: RegistrationError) {
  const status = ERROR_TO_STATUS[e.code] ?? 400;
  reply.code(status).send({ error: e.code, message: e.message });
}

function requirePerson(req: FastifyRequest, reply: FastifyReply): string | null {
  if (!req.user?.personId) {
    reply.code(401).send({ error: 'UNAUTHORIZED' });
    return null;
  }
  return req.user.personId;
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

export const registrationsController = {
  async create(req: FastifyRequest, reply: FastifyReply) {
    const personId = requirePerson(req, reply);
    if (!personId) return;
    const parsed = createRegistrationSchema.parse(req.body);
    try {
      const registration = await registrationsService.create(
        req.server.db,
        personId,
        parsed,
      );
      reply.code(201);
      return registration;
    } catch (e) {
      if (e instanceof RegistrationError) return sendError(reply, e);
      throw e;
    }
  },

  async listMine(req: FastifyRequest, reply: FastifyReply) {
    const personId = requirePerson(req, reply);
    if (!personId) return;
    const items = await registrationsService.listMine(req.server.db, personId);
    return { items };
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const { id } = req.params as { id: string };
    try {
      // Admin pode ver qualquer inscrição (com person/event); participante só
      // a própria.
      if (req.user.role !== 'participante') {
        return await registrationsService.getByIdAdmin(req.server.db, id);
      }
      if (!req.user.personId) {
        reply.code(401).send({ error: 'UNAUTHORIZED' });
        return;
      }
      return await registrationsService.getById(
        req.server.db,
        id,
        req.user.personId,
      );
    } catch (e) {
      if (e instanceof RegistrationError) return sendError(reply, e);
      throw e;
    }
  },

  async cancel(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const { id } = req.params as { id: string };
    try {
      // Admin pode cancelar a qualquer momento (inclusive confirmadas).
      if (req.user.role !== 'participante') {
        const parsed = adminCancelRegistrationSchema.parse(req.body ?? {});
        return await registrationsService.adminCancel(req.server.db, id, parsed);
      }
      if (!req.user.personId) {
        reply.code(401).send({ error: 'UNAUTHORIZED' });
        return;
      }
      const parsed = cancelRegistrationSchema.parse(req.body ?? {});
      return await registrationsService.cancel(
        req.server.db,
        id,
        req.user.personId,
        parsed,
      );
    } catch (e) {
      if (e instanceof RegistrationError) return sendError(reply, e);
      throw e;
    }
  },

  async approve(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      return await registrationsService.approve(
        req.server.db,
        id,
        req.user!.id,
      );
    } catch (e) {
      if (e instanceof RegistrationError) return sendError(reply, e);
      throw e;
    }
  },

  async reject(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = rejectRegistrationSchema.parse(req.body ?? {});
    try {
      return await registrationsService.reject(req.server.db, id, parsed);
    } catch (e) {
      if (e instanceof RegistrationError) return sendError(reply, e);
      throw e;
    }
  },

  async markAttended(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      return await registrationsService.markAttended(req.server.db, id);
    } catch (e) {
      if (e instanceof RegistrationError) return sendError(reply, e);
      throw e;
    }
  },

  async listByEvent(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { eventId } = req.params as { eventId: string };
    const items = await registrationsService.listByEvent(req.server.db, eventId);
    return { items };
  },

  async listAllPending(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await registrationsService.listAllPending(req.server.db);
    return { items };
  },
};
