import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from './schemas.ts';
import { AnnouncementError, communicationService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

const ERROR_TO_STATUS: Record<AnnouncementError['code'], number> = {
  NOT_FOUND: 404,
};

function sendError(reply: FastifyReply, e: AnnouncementError) {
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

export const communicationController = {
  // GET /v1/communication/announcements — lista publicados (visível pro app).
  async listAnnouncements(req: FastifyRequest) {
    const items = await communicationService.listPublishedAnnouncements(
      req.server.db,
    );
    return { items };
  },

  async listAllForAdmin(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const items = await communicationService.listAllForAdmin(req.server.db);
    return { items };
  },

  async createAnnouncement(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const parsed = createAnnouncementSchema.parse(req.body);
    const created = await communicationService.create(
      req.server.db,
      parsed,
      req.user!.id,
    );
    reply.code(201);
    return created;
  },

  async updateAnnouncement(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    const parsed = updateAnnouncementSchema.parse(req.body);
    try {
      return await communicationService.update(
        req.server.db,
        id,
        parsed,
        req.user!.id,
      );
    } catch (e) {
      if (e instanceof AnnouncementError) return sendError(reply, e);
      throw e;
    }
  },

  async deleteAnnouncement(req: FastifyRequest, reply: FastifyReply) {
    if (!requireAdmin(req, reply)) return;
    const { id } = req.params as { id: string };
    try {
      await communicationService.delete(req.server.db, id);
      reply.code(204);
      return;
    } catch (e) {
      if (e instanceof AnnouncementError) return sendError(reply, e);
      throw e;
    }
  },

  subscribePush: notImplemented,
  listMyNotifications: notImplemented,
  markRead: notImplemented,
};
