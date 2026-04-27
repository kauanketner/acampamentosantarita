import type { FastifyPluginAsync } from 'fastify';
import { personsController } from './controller.ts';

export const personsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { schema: { tags: ['persons'] } }, personsController.list);
  app.post('/', { schema: { tags: ['persons'] } }, personsController.create);
  app.get('/:id', { schema: { tags: ['persons'] } }, personsController.getById);
  app.patch('/:id', { schema: { tags: ['persons'] } }, personsController.update);
  app.delete('/:id', { schema: { tags: ['persons'] } }, personsController.softDelete);
  app.get('/:id/full-profile', { schema: { tags: ['persons'] } }, personsController.fullProfile);
  app.patch('/:id/avatar', { schema: { tags: ['persons'] } }, personsController.updateAvatar);
};
