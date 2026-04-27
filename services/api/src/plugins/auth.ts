import cookie from '@fastify/cookie';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '../env.ts';
import { SESSION_COOKIE, lookupSession } from '../lib/session.ts';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; role: string; personId: string | null; email: string };
  }
  interface FastifyInstance {
    requireAuth: (roles?: string[]) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  await app.register(cookie, {
    secret: env.BETTER_AUTH_SECRET,
  });

  // Hook global: tenta popular request.user a cada request, sem bloquear.
  app.addHook('onRequest', async (req) => {
    const sessionId = req.cookies[SESSION_COOKIE];
    if (!sessionId) return;
    const found = await lookupSession(app.db, sessionId);
    if (found) {
      req.user = {
        id: found.user.id,
        role: found.user.role,
        personId: found.user.personId,
        email: found.user.email,
      };
    }
  });

  app.decorate('requireAuth', (roles?: string[]) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      if (!req.user) {
        reply.code(401).send({ error: 'UNAUTHORIZED' });
        return;
      }
      if (roles && !roles.includes(req.user.role)) {
        reply.code(403).send({ error: 'FORBIDDEN' });
      }
    };
  });
};

export const authPlugin = fp(plugin, { name: 'auth' });
