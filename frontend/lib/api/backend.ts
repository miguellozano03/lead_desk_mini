import { API_URL } from "./config";

export class BackendError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  searchParams?: Record<string, string | undefined>;
};

export async function backendFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = new URL(path, API_URL);

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new BackendError(res.status, data.detail ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
