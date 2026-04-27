import type { FastifyPluginAsync } from 'fastify';
import { authController } from './controller.ts';

export const authRoutes: FastifyPluginAsync = async (app) => {
  // Cadastro — após criar a conta, envia código via WhatsApp para confirmar
  app.post(
    '/register-first-timer',
    { schema: { tags: ['auth'] } },
    authController.registerFirstTimer,
  );
  app.post(
    '/register-veteran',
    { schema: { tags: ['auth'] } },
    authController.registerVeteran,
  );

  // OTP via WhatsApp
  app.post('/request-code', { schema: { tags: ['auth'] } }, authController.requestCode);
  app.post('/verify-code', { schema: { tags: ['auth'] } }, authController.verifyCode);

  app.post('/logout', { schema: { tags: ['auth'] } }, authController.logout);
  app.get('/me', { schema: { tags: ['auth'] } }, authController.me);
};
