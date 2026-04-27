import type { FastifyPluginAsync } from 'fastify';
import { communicationController } from './controller.ts';

export const communicationRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/announcements',
    { schema: { tags: ['communication'] } },
    communicationController.listAnnouncements,
  );
  app.post(
    '/announcements',
    { schema: { tags: ['communication'] } },
    communicationController.createAnnouncement,
  );
  app.patch(
    '/announcements/:id',
    { schema: { tags: ['communication'] } },
    communicationController.updateAnnouncement,
  );

  app.post(
    '/push/subscribe',
    { schema: { tags: ['communication'] } },
    communicationController.subscribePush,
  );

  app.get(
    '/notifications/me',
    { schema: { tags: ['communication'] } },
    communicationController.listMyNotifications,
  );
  app.post(
    '/notifications/mark-read',
    { schema: { tags: ['communication'] } },
    communicationController.markRead,
  );
};
