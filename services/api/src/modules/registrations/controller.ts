import type { FastifyReply, FastifyRequest } from 'fastify';
import { cancelRegistrationSchema, createRegistrationSchema } from './schemas.ts';
import { RegistrationError, registrationsService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

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
    const personId = requirePerson(req, reply);
    if (!personId) return;
    const { id } = req.params as { id: string };
    try {
      return await registrationsService.getById(req.server.db, id, personId);
    } catch (e) {
      if (e instanceof RegistrationError) return sendError(reply, e);
      throw e;
    }
  },

  async cancel(req: FastifyRequest, reply: FastifyReply) {
    const personId = requirePerson(req, reply);
    if (!personId) return;
    const { id } = req.params as { id: string };
    const parsed = cancelRegistrationSchema.parse(req.body ?? {});
    try {
      return await registrationsService.cancel(req.server.db, id, personId, parsed);
    } catch (e) {
      if (e instanceof RegistrationError) return sendError(reply, e);
      throw e;
    }
  },

  approve: notImplemented,
  reject: notImplemented,
  markAttended: notImplemented,
  listByEvent: notImplemented,
};
