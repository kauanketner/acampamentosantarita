import { schema } from '@santarita/db';
import type { Database } from '@santarita/db';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { sendOTP, toE164 } from './whatsapp.ts';

const CODE_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function generateCode(): string {
  // 6 dígitos, sempre começando entre 1-9 para clareza visual.
  return String(100000 + Math.floor(Math.random() * 900000));
}

export async function issueAuthCode(
  db: Database,
  phoneE164: string,
  purpose: 'login' | 'register' = 'login',
): Promise<{ delivered: boolean; reason?: string; expiresAt: Date }> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  await db.insert(schema.authCodes).values({
    phone: phoneE164,
    code,
    purpose,
    expiresAt,
  });

  const send = await sendOTP(phoneE164, code);
  return { ...send, expiresAt };
}

export async function consumeAuthCode(
  db: Database,
  phoneE164: string,
  inputCode: string,
): Promise<{ ok: boolean; reason?: 'EXPIRED' | 'INVALID' | 'TOO_MANY_ATTEMPTS' }> {
  // Pega o código mais recente não consumido para esse telefone
  const [latest] = await db
    .select()
    .from(schema.authCodes)
    .where(and(eq(schema.authCodes.phone, phoneE164), isNull(schema.authCodes.consumedAt)))
    .orderBy(desc(schema.authCodes.createdAt))
    .limit(1);

  if (!latest) return { ok: false, reason: 'INVALID' };
  if (latest.attempts >= MAX_ATTEMPTS) return { ok: false, reason: 'TOO_MANY_ATTEMPTS' };
  if (latest.expiresAt.getTime() < Date.now()) return { ok: false, reason: 'EXPIRED' };

  if (latest.code !== inputCode.replace(/\D/g, '')) {
    await db
      .update(schema.authCodes)
      .set({ attempts: latest.attempts + 1 })
      .where(eq(schema.authCodes.id, latest.id));
    return { ok: false, reason: 'INVALID' };
  }

  await db
    .update(schema.authCodes)
    .set({ consumedAt: new Date() })
    .where(eq(schema.authCodes.id, latest.id));

  return { ok: true };
}

export { toE164 };
