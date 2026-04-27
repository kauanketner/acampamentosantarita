// Cliente HTTP base para o admin. Será substituído por @santarita/api-client
// quando a geração via OpenAPI estiver pronta.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`api ${path} → ${res.status}`);
  }
  return (await res.json()) as T;
}
