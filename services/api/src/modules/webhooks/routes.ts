import type { FastifyPluginAsync } from 'fastify';
import { webhooksController } from './controller.ts';

export const webhooksRoutes: FastifyPluginAsync = async (app) => {
  app.post('/asaas', { schema: { tags: ['webhooks'] } }, webhooksController.asaas);
};
