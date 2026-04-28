import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../env.ts';
import {
  SESSION_COOKIE,
  createSession,
  destroySession,
  sessionCookieOptions,
} from '../../lib/session.ts';
import { maskPhone } from '../../lib/whatsapp.ts';
import {
  firstTimerSignupSchema,
  requestCodeSchema,
  verifyCodeSchema,
  veteranSignupSchema,
} from './schemas.ts';
import { AuthError, authService } from './service.ts';

const SECURE = env.NODE_ENV === 'production';

export const authController = {
  async registerFirstTimer(req: FastifyRequest, reply: FastifyReply) {
    const parsed = firstTimerSignupSchema.parse(req.body);
    try {
      const result = await authService.registerFirstTimer(req.server.db, parsed);
      return {
        userId: result.user.id,
        phoneMasked: maskPhone(result.phoneE164),
        codeExpiresAt: result.codeExpiresAt,
      };
    } catch (e) {
      if (e instanceof AuthError) {
        reply.code(409).send({ error: e.code, message: e.message });
        return;
      }
      throw e;
    }
  },

  async registerVeteran(req: FastifyRequest, reply: FastifyReply) {
    const parsed = veteranSignupSchema.parse(req.body);
    try {
      const result = await authService.registerVeteran(req.server.db, parsed);
      return {
        userId: result.user.id,
        phoneMasked: maskPhone(result.phoneE164),
        codeExpiresAt: result.codeExpiresAt,
      };
    } catch (e) {
      if (e instanceof AuthError) {
        reply.code(409).send({ error: e.code, message: e.message });
        return;
      }
      throw e;
    }
  },

  async requestCode(req: FastifyRequest, reply: FastifyReply) {
    const parsed = requestCodeSchema.parse(req.body);
    const result = await authService.requestCode(req.server.db, parsed.phone);
    void reply;
    return {
      phoneMasked: maskPhone(result.phoneE164),
      // exists=false sinaliza ao app que precisa fazer cadastro primeiro
      exists: result.exists,
      expiresAt: result.expiresAt,
    };
  },

  async verifyCode(req: FastifyRequest, reply: FastifyReply) {
    const parsed = verifyCodeSchema.parse(req.body);
    try {
      const user = await authService.verifyCode(req.server.db, parsed.phone, parsed.code);
      const session = await createSession(req.server.db, user.id, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      reply.setCookie(SESSION_COOKIE, session.id, sessionCookieOptions(SECURE));
      return {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      };
    } catch (e) {
      if (e instanceof AuthError) {
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
        phone: data.user.phone,
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
};
