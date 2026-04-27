import { mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { randomUUID } from 'node:crypto';

// Storage local — MVP. Para produção trocar por Cloudflare R2 em lib/r2.ts.
const UPLOAD_DIR = join(process.cwd(), 'uploads');

export async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function saveUpload(
  buffer: Buffer,
  originalFilename: string,
  prefix = '',
): Promise<{ url: string; path: string }> {
  await ensureUploadDir();
  const ext = extname(originalFilename) || '.bin';
  const id = randomUUID();
  const filename = prefix ? `${prefix}-${id}${ext}` : `${id}${ext}`;
  const fullPath = join(UPLOAD_DIR, filename);
  await Bun.write(fullPath, buffer);
  return {
    url: `/uploads/${filename}`,
    path: fullPath,
  };
}

export const UPLOADS_PATH = UPLOAD_DIR;
