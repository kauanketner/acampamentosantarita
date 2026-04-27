import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().min(1),

  BETTER_AUTH_SECRET: z.string().min(1).default('dev-secret-change-me'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3333'),

  ASAAS_API_KEY: z.string().optional(),
  ASAAS_WEBHOOK_TOKEN: z.string().optional(),
  ASAAS_ENV: z.enum(['sandbox', 'production']).default('sandbox'),

  // WhatsApp via WTS Chat (api.wts.chat) — usado para enviar códigos OTP
  WTS_API_TOKEN: z.string().optional(),
  WTS_OTP_TEMPLATE_ID: z.string().default('codigo_de_verificao'),
  WTS_FROM_NUMBER: z.string().optional(),

  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_PUBLIC_URL: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().default('contato@acampamentosantarita.com.br'),

  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().default('mailto:contato@acampamentosantarita.com.br'),

  SHOP_WHATSAPP_NUMBER: z.string().optional(),

  WEB_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_URL: z.string().url().default('http://localhost:3001'),
  APP_URL: z.string().url().default('http://localhost:3002'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
