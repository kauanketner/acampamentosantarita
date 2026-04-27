import { randomBytes } from 'node:crypto';
import { schema } from '@santarita/db';
import { and, eq, gt } from 'drizzle-orm';
import type { Database } from '@santarita/db';

const COOKIE_NAME = 'sr_session';
const SESSION_DAYS = 30;

export function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}

export async function createSession(
  db: Database,
  userId: string,
  meta: { ipAddress?: string; userAgent?: string } = {},
): Promise<{ id: string; expiresAt: Date }> {
  const id = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(schema.sessions).values({
    id,
    userId,
    expiresAt,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
  return { id, expiresAt };
}

export async function lookupSession(db: Database, id: string) {
  const rows = await db
    .select({
      session: schema.sessions,
      user: schema.users,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(and(eq(schema.sessions.id, id), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0];
}

export async function destroySession(db: Database, id: string) {
  await db.delete(schema.sessions).where(eq(schema.sessions.id, id));
}

export const SESSION_COOKIE = COOKIE_NAME;

export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure,
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
