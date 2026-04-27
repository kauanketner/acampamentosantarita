import { env } from '../env.ts';

const WTS_BASE = 'https://api.wts.chat/chat';

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

// Envia o código de verificação via WhatsApp usando o template oficial.
// Em desenvolvimento (sem WTS_API_TOKEN), apenas loga o código no console.
export async function sendOTP(phoneE164: string, code: string): Promise<SendResult> {
  if (!env.WTS_API_TOKEN) {
    console.log(`\n[OTP DEV] ${phoneE164} → ${code}\n`);
    return { delivered: false, reason: 'dev_mode_no_token' };
  }

  const templateId = env.WTS_OTP_TEMPLATE_ID || 'codigo_de_verificao';

  try {
    const res = await fetch(`${WTS_BASE}/v1/message/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.WTS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.WTS_FROM_NUMBER || undefined,
        to: phoneE164,
        body: {
          templateId,
          parameters: {
            codigo: code,
          },
        },
      }),
    });

    const data = (await res.json().catch(() => null)) as
      | { id?: string; status?: string; failureReason?: string }
      | null;

    if (!res.ok) {
      console.error('[WTS] envio falhou', res.status, data);
      // Em dev/staging: ainda logar o código para não bloquear testes
      console.log(`\n[OTP FALLBACK] ${phoneE164} → ${code}\n`);
      return {
        delivered: false,
        reason: data?.failureReason ?? `http_${res.status}`,
      };
    }

    return { delivered: true, messageId: data?.id };
  } catch (err) {
    console.error('[WTS] erro de rede', err);
    console.log(`\n[OTP FALLBACK] ${phoneE164} → ${code}\n`);
    return { delivered: false, reason: 'network' };
  }
}
