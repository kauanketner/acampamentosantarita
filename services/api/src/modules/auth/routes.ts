import type { FastifyPluginAsync } from 'fastify';
import { authController } from './controller.ts';

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/login', { schema: { tags: ['auth'] } }, authController.login);
  app.post(
    '/register-first-timer',
    { schema: { tags: ['auth'] } },
    authController.registerFirstTimer,
  );
  app.post('/register-veteran', { schema: { tags: ['auth'] } }, authController.registerVeteran);
  app.post('/logout', { schema: { tags: ['auth'] } }, authController.logout);
  app.post('/forgot-password', { schema: { tags: ['auth'] } }, authController.forgotPassword);
  app.post('/reset-password', { schema: { tags: ['auth'] } }, authController.resetPassword);
  app.get('/me', { schema: { tags: ['auth'] } }, authController.me);
};
