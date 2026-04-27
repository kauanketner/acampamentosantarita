import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

// TODO: integrar Better Auth.
// - sessão via cookie HttpOnly
// - decorator app.requireAuth(roles?)
// - hook que injeta request.user e request.person

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; role: string; personId?: string };
  }
  interface FastifyInstance {
    requireAuth: (roles?: string[]) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  app.decorate('requireAuth', (_roles?: string[]) => {
    return async (_req: FastifyRequest, reply: FastifyReply) => {
      // TODO: validar sessão Better Auth, popular req.user, checar roles
      reply.code(501).send({ error: 'AUTH_NOT_IMPLEMENTED' });
    };
  });
};

export const authPlugin = fp(plugin, { name: 'auth' });
