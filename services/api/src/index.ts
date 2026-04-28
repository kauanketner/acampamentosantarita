import { env } from './env.ts';
import { buildServer } from './server.ts';

const app = await buildServer();

try {
  await app.listen({ port: env.PORT, host: env.HOST });
  app.log.info(`API rodando em http://${env.HOST}:${env.PORT}`);
  app.log.info(`Swagger disponível em http://${env.HOST}:${env.PORT}/docs`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
