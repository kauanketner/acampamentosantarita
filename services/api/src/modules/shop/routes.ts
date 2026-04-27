import type { FastifyPluginAsync } from 'fastify';
import { shopController } from './controller.ts';

export const shopRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { schema: { tags: ['shop'] } }, shopController.list);
  app.post('/', { schema: { tags: ['shop'] } }, shopController.create);
  app.patch('/:id', { schema: { tags: ['shop'] } }, shopController.update);
  app.delete('/:id', { schema: { tags: ['shop'] } }, shopController.delete);
};
