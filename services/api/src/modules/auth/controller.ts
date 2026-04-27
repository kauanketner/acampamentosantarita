import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../env.ts';
import {
  SESSION_COOKIE,
  createSession,
  destroySession,
  sessionCookieOptions,
} from '../../lib/session.ts';
import {
  firstTimerSignupSchema,
  loginSchema,
  veteranSignupSchema,
} from './schemas.ts';
import { SignupError, authService } from './service.ts';

const SECURE = env.NODE_ENV === 'production';

export const authController = {
  async registerFirstTimer(req: FastifyRequest, reply: FastifyReply) {
    const parsed = firstTimerSignupSchema.parse(req.body);
    try {
      const { user } = await authService.registerFirstTimer(req.server.db, parsed);
      const session = await createSession(req.server.db, user.id, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      reply.setCookie(SESSION_COOKIE, session.id, sessionCookieOptions(SECURE));
      return { user: { id: user.id, email: user.email, role: user.role } };
    } catch (e) {
      if (e instanceof SignupError) {
        reply.code(409).send({ error: e.code, message: e.message });
        return;
      }
      throw e;
    }
  },

  async registerVeteran(req: FastifyRequest, reply: FastifyReply) {
    const parsed = veteranSignupSchema.parse(req.body);
    try {
      const { user } = await authService.registerVeteran(req.server.db, parsed);
      const session = await createSession(req.server.db, user.id, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      reply.setCookie(SESSION_COOKIE, session.id, sessionCookieOptions(SECURE));
      return { user: { id: user.id, email: user.email, role: user.role } };
    } catch (e) {
      if (e instanceof SignupError) {
        reply.code(409).send({ error: e.code, message: e.message });
        return;
      }
      throw e;
    }
  },

  async login(req: FastifyRequest, reply: FastifyReply) {
    const parsed = loginSchema.parse(req.body);
    try {
      const user = await authService.login(req.server.db, parsed.email, parsed.password);
      const session = await createSession(req.server.db, user.id, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      reply.setCookie(SESSION_COOKIE, session.id, sessionCookieOptions(SECURE));
      return { user: { id: user.id, email: user.email, role: user.role } };
    } catch (e) {
      if (e instanceof SignupError) {
        reply.code(401).send({ error: e.code, message: e.message });
        return;
      }
      throw e;
    }
  },

  async logout(req: FastifyRequest, reply: FastifyReply) {
    const sessionId = req.cookies[SESSION_COOKIE];
    if (sessionId) {
      await destroySession(req.server.db, sessionId);
    }
    reply.clearCookie(SESSION_COOKIE, { path: '/' });
    return { ok: true };
  },

  async me(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
      return;
    }
    const data = await authService.fetchMe(req.server.db, req.user.id);
    if (!data) {
      reply.code(404).send({ error: 'NOT_FOUND' });
      return;
    }
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      },
      person: data.person && {
        id: data.person.id,
        fullName: data.person.fullName,
        avatarUrl: data.person.avatarUrl,
        city: data.person.city,
        state: data.person.state,
        shirtSize: data.person.shirtSize,
        mobilePhone: data.person.mobilePhone,
      },
    };
  },

  forgotPassword: async (_req: FastifyRequest, reply: FastifyReply) => {
    reply.code(501).send({ error: 'NOT_IMPLEMENTED' });
  },

  resetPassword: async (_req: FastifyRequest, reply: FastifyReply) => {
    reply.code(501).send({ error: 'NOT_IMPLEMENTED' });
  },
};
