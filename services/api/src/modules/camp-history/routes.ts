import type { FastifyPluginAsync } from 'fastify';
import { campHistoryController } from './controller.ts';

export const campHistoryRoutes: FastifyPluginAsync = async (app) => {
  app.get('/me', { schema: { tags: ['camp-history'] } }, campHistoryController.getMine);
  app.post('/me', { schema: { tags: ['camp-history'] } }, campHistoryController.addLegacy);
  app.delete('/me/:id', { schema: { tags: ['camp-history'] } }, campHistoryController.removeLegacy);
  app.get(
    '/persons/:id',
    { schema: { tags: ['camp-history'] } },
    campHistoryController.getByPersonId,
  );
};
