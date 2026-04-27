import type { FastifyPluginAsync } from 'fastify';
import { faithController } from './controller.ts';

export const faithRoutes: FastifyPluginAsync = async (app) => {
  app.get('/me', { schema: { tags: ['faith'] } }, faithController.getMine);
  app.put('/me', { schema: { tags: ['faith'] } }, faithController.upsertMine);
  app.get('/persons/:id', { schema: { tags: ['faith'] } }, faithController.getByPersonId);
};
