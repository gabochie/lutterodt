interface KVNamespace {
  get(key: string, options?: Partial<{ type: "text" }>): Promise<string | null>;
  get(key: string, options: { type: "json" }): Promise<unknown>;
  put(key: string, value: string | ReadableStream | ArrayBuffer | FormData, options?: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: unknown): Promise<{ keys: { name: string }[] }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
  exec(query: string): Promise<D1Result>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T>;
  run<T = D1Result>(): Promise<T>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean; meta: Record<string, unknown> }>;
  raw(): Promise<unknown[][]>;
}

interface D1Result {
  success: boolean;
  results: Record<string, unknown>[];
  meta: Record<string, unknown>;
  error?: string;
}

interface CloudflareEnv {
  LUTTERODT_KV: KVNamespace;
  LUTTERODT_D1: D1Database;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  IMAGES: unknown;
  WORKER_SELF_REFERENCE: { fetch: (request: Request) => Promise<Response> };
}
