const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

type Init = RequestInit & { json?: unknown };

export async function api<T>(path: string, init?: Init): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...((headers as Record<string, string>) ?? {}),
  };
  let body = rest.body;
  if (json !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  }

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: finalHeaders,
    ...rest,
    body,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : null;

  if (!res.ok) {
    const code = (data as { error?: string } | null)?.error ?? 'HTTP_ERROR';
    const msg =
      (data as { message?: string } | null)?.message ??
      `Erro ${res.status} em ${path}`;
    throw new ApiError(res.status, code, msg, data);
  }

  return data as T;
}

export const API_BASE_URL = API_URL;
