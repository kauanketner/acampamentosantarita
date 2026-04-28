// Helper minimalista para consumir os endpoints /public/* do backend.
// Usado em Server Components do Next (SSR/SSG).

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

type FetchOpts = RequestInit & {
  revalidate?: number;
  /** Timeout em ms — o build não fica esperando se a API estiver fora. */
  timeoutMs?: number;
};

export async function fetchPublic<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { revalidate = 60, timeoutMs = 5000, ...init } = opts;
  const extraNext = (init as { next?: Record<string, unknown> }).next ?? {};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}/public${path}`, {
      ...init,
      signal: controller.signal,
      next: { revalidate, ...extraNext },
    });
    if (!res.ok) {
      throw new Error(`fetchPublic ${path} → ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Versão tolerante: nunca lança. Retorna `fallback` se o backend falhar
 * (por exemplo durante build sem API ou enquanto a API está fora).
 */
export async function fetchPublicSafe<T>(
  path: string,
  fallback: T,
  opts: FetchOpts = {},
): Promise<T> {
  try {
    return await fetchPublic<T>(path, opts);
  } catch {
    return fallback;
  }
}
