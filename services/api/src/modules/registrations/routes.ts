import type { FastifyPluginAsync } from 'fastify';
import { registrationsController } from './controller.ts';

export const registrationsRoutes: FastifyPluginAsync = async (app) => {
  app.post('/', { schema: { tags: ['registrations'] } }, registrationsController.create);
  app.get('/me', { schema: { tags: ['registrations'] } }, registrationsController.listMine);
  app.get('/:id', { schema: { tags: ['registrations'] } }, registrationsController.getById);

  app.post(
    '/:id/approve',
    { schema: { tags: ['registrations'] } },
    registrationsController.approve,
  );
  app.post('/:id/reject', { schema: { tags: ['registrations'] } }, registrationsController.reject);
  app.post('/:id/cancel', { schema: { tags: ['registrations'] } }, registrationsController.cancel);
  app.post(
    '/:id/mark-attended',
    { schema: { tags: ['registrations'] } },
    registrationsController.markAttended,
  );

  app.get(
    '/event/:eventId',
    { schema: { tags: ['registrations'] } },
    registrationsController.listByEvent,
  );
};
