const API_BASES = Array.from(
  new Set(
    [
      ...(import.meta.env.PROD
        ? [import.meta.env.VITE_API_BASE_URL as string | undefined]
        : [
            import.meta.env.VITE_API_BASE_URL as string | undefined,
            import.meta.env.VITE_API_URL as string | undefined,
          ]),
    ]
      .map((value) => String(value || "").trim().replace(/\/$/, ""))
      .filter(Boolean)
  )
);

if (import.meta.env.PROD && !API_BASES.length) {
  throw new Error("API_NOT_CONFIGURED: VITE_API_BASE_URL is required in production");
}

type PostOptions = {
  keepalive?: boolean;
  headers?: Record<string, string>;
};

export async function postJson(
  path: string,
  payload: unknown,
  options: PostOptions = {}
): Promise<Response> {
  if (!API_BASES.length) {
    throw new Error("API_NOT_CONFIGURED");
  }

  let lastError: unknown;

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(payload),
        keepalive: options.keepalive,
      });

      if (response.ok || response.status < 500) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("API_UNAVAILABLE");
}
