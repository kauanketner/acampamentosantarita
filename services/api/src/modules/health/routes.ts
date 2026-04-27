import type { FastifyPluginAsync } from 'fastify';
import { healthController } from './controller.ts';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/me', { schema: { tags: ['health'] } }, healthController.getMine);
  app.put('/me', { schema: { tags: ['health'] } }, healthController.upsertMine);
  app.get(
    '/persons/:id',
    { schema: { tags: ['health'] } },
    healthController.getByPersonId,
  );
};
