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
  first<T = unknown>(colName?: string): Promise<T>;
  run(): Promise<D1Result>;
  all(): Promise<D1Result>;
  raw(): Promise<unknown[][]>;
}

interface D1Result {
  success: boolean;
  results: Record<string, unknown>[];
  meta: Record<string, unknown>;
  error?: string;
}
