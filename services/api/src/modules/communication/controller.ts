import type { FastifyReply, FastifyRequest } from 'fastify';
import { communicationService } from './service.ts';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const communicationController = {
  // GET /v1/communication/announcements — lista publicados (visível pro app).
  async listAnnouncements(req: FastifyRequest) {
    const items = await communicationService.listPublishedAnnouncements(
      req.server.db,
    );
    return { items };
  },

  createAnnouncement: notImplemented,
  updateAnnouncement: notImplemented,
  subscribePush: notImplemented,
  listMyNotifications: notImplemented,
  markRead: notImplemented,
};
