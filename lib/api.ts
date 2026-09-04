import axios, { AxiosError, type AxiosRequestConfig } from "axios";

interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

interface ErrorResponse {
  success?: boolean;
  error?: {
    code?: string;
    message?: string | ValidationError[];
  };
  detail?: string;
  message?: string;
}

export type RateLimitInfo = {
  limit: number | null
  remaining: number | null
  resetAt: Date | null
  retryAfter: number | null
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export class RateLimitError extends Error {
  type = "RATE_LIMIT_EXCEEDED" as const;
  status = 429 as const;
  resetAt: Date | null;
  retryAfter: number | null;
  limit: number | null;
  remaining: number | null;
  data: any;
  constructor(opts: {
    message?: string;
    resetAt: Date | null;
    retryAfter: number | null;
    limit: number | null;
    remaining: number | null;
    data?: any;
  }) {
    super(opts.message ?? "Too Many requests. Please try again later.");
    this.resetAt = opts.resetAt;
    this.retryAfter = opts.retryAfter;
    this.limit = opts.limit;
    this.remaining = opts.remaining;
    this.data = opts.data;
  }
}

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const ERROR_MESSAGES: Record<string, string> = {
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image.',
  INVALID_IMAGE: 'Invalid image. Please upload a valid image.',
  INVALID_API_KEY: 'Invalid API key.',
  UNSUPPORTED_PROVIDER: 'Unsupported provider or model.',
  AI_REQUEST_TIMEOUT: 'The AI request timed out. Please try again.',
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again.',
}

function num(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

/**
 * Works with both axios' AxiosHeaders (which has a `.get`) and plain
 * header objects, so it can also be reused if you ever hand it a
 * fetch Response's `headers`.
 */
export function parseRateLimitHeaders(headers: any, body?: any): RateLimitInfo {
  const get = (k: string) => {
    if (!headers) return null;
    if (typeof headers.get === "function") return headers.get(k);
    return headers[k] ?? headers[k.toLowerCase()] ?? null;
  };

  const limit = num(get("x-ratelimit-limit"));
  const remaining = num(get("x-ratelimit-remaining"));
  const resetRaw = num(get("x-ratelimit-reset") ?? body?.error?.reset ?? body?.reset);
  const resetAt = resetRaw == null ? null : new Date(resetRaw * 1000);

  let retryAfter = num(get("retry-after"));
  if (retryAfter == null && resetAt) {
    retryAfter = Math.max(0, Math.ceil((resetAt.getTime() - Date.now()) / 1000));
  }

  return { limit, remaining, resetAt, retryAfter };
}

export const http = axios.create({
  baseURL: API_BASE,
  timeout: 60_000,
});

http.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    const original = error.config
    const url = original?.url ?? ""
    const body: any = error.response?.data

    if (error.response?.status === 429) {
      const parsedHeaders = parseRateLimitHeaders(
        error.response.headers,
        error.response.data
      );

      const message = body?.error?.message ?? "Too Many requests. Please try again later.";

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("api:rate-limited", {
            detail: { ...parsedHeaders, url, method: original?.method },
          }),
        );
      }
      return Promise.reject(
        new RateLimitError({ message, ...parsedHeaders, data: body }),
      );
    }
    return Promise.reject(error);
  },
);

function normalize(err: unknown): never {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    // Handle request timeout
    if (err.code === "ECONNABORTED") {
      throw new ApiError(
        408,
        "The request is taking longer than expected. Please try again."
      );
    }

    // Network error (no response received)
    if (!err.response) {
      throw new ApiError(
        0,
        "Unable to connect. Please check your internet connection and try again."
      );
    }

    const status = err.response.status;
    const body: any = err.response.data;

    // Validation error
    if (status === 422) {
      throw new ApiError(
        422,
        "We couldn't process your request because some information is invalid. Please try again.",
        body
      );
    }

    throw new ApiError(
      status,
      typeof body?.error?.message === "string"
        ? body.error.message
        : body?.detail ??
        body?.message ??
        err.message ??
        "Something went wrong while processing your request. Please try again.",
      body
    );
  }

  throw err;
}

/**
 * Thin wrapper that preserves the existing call signature used across pages:
 *   api<T>("/path", { method, body })
 * `body` is a JSON string (kept for compatibility with existing call sites).
 */
export async function api<T = any>(
  path: string,
  init: {
    method?: string
    body?: string | FormData
    headers?: Record<string, string>
  } = {},
): Promise<T> {
  try {
    const isFormData = init.body instanceof FormData
    
    const res = await http.request<T>({
      url: path,
      method: init.method ?? "GET",
      data: isFormData
        ? init.body
        : init.body && typeof init.body == "string"
          ? JSON.parse(init.body)
          : undefined,
      headers: init.headers,
    } as AxiosRequestConfig);
    return res.data;
  } catch (e) {
    normalize(e);
  }
}

export function friendlyError(error: unknown) {
  return error instanceof ApiError ?
    error.message || ERROR_MESSAGES[error.data?.error?.code] : "Something went wrong. Please try again.";
}
