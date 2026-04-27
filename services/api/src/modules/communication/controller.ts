import type { FastifyReply, FastifyRequest } from 'fastify';

const notImplemented = (_req: FastifyRequest, reply: FastifyReply) =>
  reply.code(501).send({ error: 'NOT_IMPLEMENTED' });

export const communicationController = {
  listAnnouncements: notImplemented,
  // ao publicar com sendPush=true, dispara web-push para audiência alvo
  createAnnouncement: notImplemented,
  updateAnnouncement: notImplemented,
  // PWA: registra subscription { endpoint, keys }
  subscribePush: notImplemented,
  listMyNotifications: notImplemented,
  // body: { ids: string[] } — marca lidas
  markRead: notImplemented,
};
