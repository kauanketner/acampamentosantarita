import type { FastifyPluginAsync } from 'fastify';
import { reportsController } from './controller.ts';

export const reportsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/dashboard', { schema: { tags: ['reports'] } }, reportsController.dashboard);
  app.get('/registrations', { schema: { tags: ['reports'] } }, reportsController.registrations);
  app.get('/finance', { schema: { tags: ['reports'] } }, reportsController.finance);
  app.get(
    '/participants-by-event',
    { schema: { tags: ['reports'] } },
    reportsController.participantsByEvent,
  );
  app.get('/legacy-history', { schema: { tags: ['reports'] } }, reportsController.legacyHistory);
  app.get('/audit', { schema: { tags: ['reports'] } }, reportsController.audit);
};
