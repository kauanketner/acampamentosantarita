import { env } from '../env.ts';

const WTS_BASE = 'https://api.wts.chat/chat';
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SendResult = {
  delivered: boolean;
  messageId?: string;
  reason?: string;
};

// Converte telefone (raw 10/11 dígitos ou já com 55) para E.164.
export function toE164(phoneRaw: string): string {
  const digits = phoneRaw.replace(/\D/g, '');
  if (digits.startsWith('55')) return `+${digits}`;
  return `+55${digits}`;
}

// Mascara telefone E.164 para feedback ao usuário.
// "+5511987654321" → "+55 11 *****-4321"
export function maskPhone(e164: string): string {
  const digits = e164.replace(/\D/g, '');
  if (digits.length < 4) return e164;
  const last4 = digits.slice(-4);
  if (digits.startsWith('55') && digits.length >= 12) {
    const ddd = digits.slice(2, 4);
    return `+55 ${ddd} *****-${last4}`;
  }
  return `+****-${last4}`;
}

// Cache do UUID resolvido — evita chamar /v1/template a cada OTP.
let cachedTemplateUuid: string | null = null;

async function resolveTemplateId(token: string, raw: string): Promise<string> {
  if (UUID_RE.test(raw)) return raw;
  if (cachedTemplateUuid) return cachedTemplateUuid;

  const url = new URL(`${WTS_BASE}/v1/template`);
  url.searchParams.set('Name', raw);
  url.searchParams.set('Type', 'AUTHENTICATION');
  url.searchParams.set('ApprovedOnly', 'true');
  url.searchParams.set('PageSize', '5');

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`template lookup failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as {
    items?: Array<{ id: string; name?: string }>;
  };
  const match = data.items?.find((t) => t.name === raw) ?? data.items?.[0];
  if (!match?.id) {
    throw new Error(`template "${raw}" não encontrado na conta WTS`);
  }
  cachedTemplateUuid = match.id;
  return match.id;
}

// Envia o código de verificação via WhatsApp usando o endpoint dedicado de OTP.
// O WTS cuida de preencher body + botão "Copiar código" automaticamente.
// Em desenvolvimento (sem WTS_API_TOKEN), apenas loga o código no console.
export async function sendOTP(phoneE164: string, code: string): Promise<SendResult> {
  if (!env.WTS_API_TOKEN) {
    console.log(`\n[OTP DEV] ${phoneE164} → ${code}\n`);
    return { delivered: false, reason: 'dev_mode_no_token' };
  }
  if (!env.WTS_FROM_NUMBER) {
    console.error('[WTS] WTS_FROM_NUMBER não configurado');
    console.log(`\n[OTP FALLBACK] ${phoneE164} → ${code}\n`);
    return { delivered: false, reason: 'missing_from_number' };
  }

  const rawTemplateId = env.WTS_OTP_TEMPLATE_ID || 'codigo_de_verificao';

  let templateId: string;
  try {
    templateId = await resolveTemplateId(env.WTS_API_TOKEN, rawTemplateId);
  } catch (err) {
    console.error('[WTS] falha ao resolver templateId', err);
    console.log(`\n[OTP FALLBACK] ${phoneE164} → ${code}\n`);
    return { delivered: false, reason: 'template_lookup_failed' };
  }

  const payload = {
    code,
    templateId,
    from: env.WTS_FROM_NUMBER,
    to: phoneE164,
  };

  try {
    const res = await fetch(`${WTS_BASE}/v1/send/otp`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.WTS_API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as
      | {
          id?: string;
          status?: string;
          failedReason?: string;
          detail?: string;
          title?: string;
        }
      | null;

    if (!res.ok) {
      console.error('[WTS] envio OTP falhou', res.status, data);
      console.log(`\n[OTP FALLBACK] ${phoneE164} → ${code}\n`);
      return {
        delivered: false,
        reason: data?.failedReason ?? data?.detail ?? `http_${res.status}`,
      };
    }

    return { delivered: true, messageId: data?.id };
  } catch (err) {
    console.error('[WTS] erro de rede', err);
    console.log(`\n[OTP FALLBACK] ${phoneE164} → ${code}\n`);
    return { delivered: false, reason: 'network' };
  }
}
