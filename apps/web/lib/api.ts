// Helper minimalista para consumir os endpoints /public/* do backend.
// Usado em Server Components do Next (SSR/SSG).

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export async function fetchPublic<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/public${path}`, {
    ...init,
    next: { revalidate: 60, ...(init as { next?: unknown })?.next },
  });
  if (!res.ok) {
    throw new Error(`fetchPublic ${path} → ${res.status}`);
  }
  return (await res.json()) as T;
}
