import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import Fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { ensureUploadDir, UPLOADS_PATH } from './lib/storage.ts';
import { authPlugin } from './plugins/auth.ts';
import { corsPlugin } from './plugins/cors.ts';
import { dbPlugin } from './plugins/db.ts';
import { errorHandlerPlugin } from './plugins/error-handler.ts';
import { rateLimitPlugin } from './plugins/rate-limit.ts';
import { swaggerPlugin } from './plugins/swagger.ts';

import { authRoutes } from './modules/auth/routes.ts';
import { campHistoryRoutes } from './modules/camp-history/routes.ts';
import { cmsRoutes } from './modules/cms/routes.ts';
import { communicationRoutes } from './modules/communication/routes.ts';
import { eventsRoutes } from './modules/events/routes.ts';
import { faithRoutes } from './modules/faith/routes.ts';
import { financeRoutes } from './modules/finance/routes.ts';
import { healthRoutes } from './modules/health/routes.ts';
import { personsRoutes } from './modules/persons/routes.ts';
import { posRoutes } from './modules/pos/routes.ts';
import { publicRoutes } from './modules/public/routes.ts';
import { registrationsRoutes } from './modules/registrations/routes.ts';
import { reportsRoutes } from './modules/reports/routes.ts';
import { serviceTeamsRoutes } from './modules/service-teams/routes.ts';
import { shopRoutes } from './modules/shop/routes.ts';
import { tribesRoutes } from './modules/tribes/routes.ts';
import { webhooksRoutes } from './modules/webhooks/routes.ts';

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        process.env.NODE_ENV === 'production'
          ? undefined
          : { target: 'pino-pretty', options: { colorize: true } },
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Plugins
  await app.register(errorHandlerPlugin);
  await app.register(corsPlugin);
  await app.register(rateLimitPlugin);
  await app.register(dbPlugin);
  await app.register(authPlugin);
  await app.register(swaggerPlugin);
  await app.register(multipart, {
    limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  });

  // Estáticos para uploads (avatares + capas)
  await ensureUploadDir();
  await app.register(staticPlugin, {
    root: UPLOADS_PATH,
    prefix: '/uploads/',
    decorateReply: false,
  });

  // Healthcheck
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  // Módulos com prefixo /v1
  await app.register(
    async (api) => {
      await api.register(authRoutes, { prefix: '/auth' });
      await api.register(personsRoutes, { prefix: '/persons' });
      await api.register(healthRoutes, { prefix: '/health' });
      await api.register(faithRoutes, { prefix: '/faith' });
      await api.register(campHistoryRoutes, { prefix: '/camp-history' });
      await api.register(eventsRoutes, { prefix: '/events' });
      await api.register(registrationsRoutes, { prefix: '/registrations' });
      await api.register(tribesRoutes, { prefix: '/tribes' });
      await api.register(serviceTeamsRoutes, { prefix: '/service-teams' });
      await api.register(financeRoutes, { prefix: '/finance' });
      await api.register(posRoutes, { prefix: '/pos' });
      await api.register(shopRoutes, { prefix: '/shop' });
      await api.register(communicationRoutes, { prefix: '/communication' });
      await api.register(cmsRoutes, { prefix: '/cms' });
      await api.register(reportsRoutes, { prefix: '/reports' });
    },
    { prefix: '/v1' },
  );

  await app.register(webhooksRoutes, { prefix: '/webhooks' });
  await app.register(publicRoutes, { prefix: '/public' });

  return app;
}
