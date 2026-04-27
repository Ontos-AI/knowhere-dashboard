import { auth } from "@lib/auth";
import { env } from "@lib/env";

export type CheckoutSessionResponse = {
  checkout_url: string;
  session_id: string;
};

export type ApiOrpcErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR";

const STATUS_TO_ORPC_ERROR_CODE: Partial<Record<number, ApiOrpcErrorCode>> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "BAD_REQUEST",
  429: "TOO_MANY_REQUESTS",
};

const EXTERNAL_CODE_TO_STATUS: Record<string, number> = {
  ALREADY_EXISTS: 409,
  INVALID_ARGUMENT: 400,
  NOT_FOUND: 404,
  PERMISSION_DENIED: 403,
  RESOURCE_EXHAUSTED: 429,
  UNAUTHENTICATED: 401,
};

const toOrpcErrorCode = (status?: number): ApiOrpcErrorCode => {
  return STATUS_TO_ORPC_ERROR_CODE[status ?? -1] ?? "INTERNAL_SERVER_ERROR";
};

export class ApiError extends Error {
  code: number | string;
  orpcCode: ApiOrpcErrorCode;
  status?: number;

  constructor(message: string, code: number | string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.orpcCode = toOrpcErrorCode(status);
    this.status = status;
  }
}

const UTC_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const getText = (value: unknown) => {
  return typeof value === "string" && value.trim() ? value : undefined;
};

const getNumber = (value: unknown) => {
  return typeof value === "number" ? value : undefined;
};

const getCode = (value: unknown) => {
  return typeof value === "string" || typeof value === "number" ? value : undefined;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    const text = await response.text();
    return text || null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

const isApiFailureResult = (result: unknown) => {
  return isObject(result) && result.success === false;
};

const getStatusFromCode = (code: unknown) => {
  if (typeof code !== "string") {
    return undefined;
  }

  return EXTERNAL_CODE_TO_STATUS[code];
};

const extractApiError = (result: unknown, httpStatus: number) => {
  const body = isObject(result) ? result : undefined;
  const nestedError = body && isObject(body.error) ? body.error : undefined;

  let firstViolation: string | undefined;
  if (
    nestedError &&
    isObject(nestedError.details) &&
    Array.isArray(nestedError.details.violations)
  ) {
    const violation = nestedError.details.violations[0];
    if (isObject(violation)) {
      firstViolation = getText(violation.description);
    }
  }

  const message =
    getText(typeof result === "string" ? result : undefined) ||
    getText(nestedError?.message) ||
    firstViolation ||
    getText(body?.message) ||
    getText(body?.detail) ||
    getText(body?.msg) ||
    `HTTP Error: ${httpStatus}`;

  const code = getCode(nestedError?.code) || getCode(body?.code) || httpStatus;

  const status =
    (httpStatus >= 400 ? httpStatus : undefined) ||
    getNumber(nestedError?.status) ||
    getNumber(nestedError?.status_code) ||
    getStatusFromCode(code) ||
    400;

  return { code, message, status };
};

function normalizeUtcDates<T>(data: T): T {
  if (typeof data === "string") {
    return (UTC_DATETIME_RE.test(data) ? `${data}Z` : data) as T;
  }
  if (Array.isArray(data)) {
    return data.map(normalizeUtcDates) as T;
  }
  if (data !== null && typeof data === "object") {
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, normalizeUtcDates(v)])) as T;
  }
  return data;
}

const performRequest = async <T = unknown>({
  authorization,
  body,
  method,
  path,
}: {
  authorization?: string;
  body?: unknown;
  method: string;
  path: string;
}): Promise<T> => {
  const url = `${env.NEXT_PUBLIC_API_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authorization) {
    headers.Authorization = authorization;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const result = await parseResponseBody(response);

  if (!response.ok || isApiFailureResult(result)) {
    const { message, code, status } = extractApiError(result, response.status);
    throw new ApiError(message, code, status);
  }

  return normalizeUtcDates(result as T);
};

export async function jwtRequest<T = unknown>({
  method,
  path,
  userId,
  body,
}: {
  method: string;
  path: string;
  userId: string;
  body?: unknown;
}): Promise<T> {
  const { token } = await auth.api.signJWT({
    body: {
      payload: { id: userId },
    },
  });

  const authorization =
    env.NODE_ENV === "development" && env.DEV_EXTERNAL_API_AUTHORIZATION
      ? env.DEV_EXTERNAL_API_AUTHORIZATION
      : `Bearer ${token}`;

  return performRequest<T>({
    authorization,
    body,
    method,
    path,
  });
}

export async function publicRequest<T = unknown>({
  method,
  path,
  body,
}: {
  method: string;
  path: string;
  body?: unknown;
}): Promise<T> {
  return performRequest<T>({ body, method, path });
}
