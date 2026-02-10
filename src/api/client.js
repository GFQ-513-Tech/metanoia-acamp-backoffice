// api/client.js
const DEFAULT_HEADERS = {
  Accept: "application/json",
};

function buildUrl(base, path = "", query) {
  // garante base com / no final
  const baseWithSlash = base.endsWith("/") ? base : `${base}/`;
  // garante path sem / no início
  const cleanPath = String(path).replace(/^\/+/, "");

  const url = new URL(cleanPath, baseWithSlash);

  if (query) {
    if (typeof query === "string") {
      url.search = query.startsWith("?") ? query : `?${query}`;
    } else {
      const sp = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        sp.set(k, String(v));
      });
      url.search = sp.toString();
    }
  }

  return url.toString();
}

async function parseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
}

/**
 * @param {object} opts
 * @param {string} opts.baseUrl ex: urlAPIServer
 * @param {string} opts.path ex: "/users"
 * @param {string} [opts.method]
 * @param {object|string} [opts.query]
 * @param {any} [opts.body]
 * @param {string} [opts.token] Bearer token
 * @param {object} [opts.headers]
 */
const apiRequest = async ({
  path,
  method = "GET",
  query,
  body,
  headers = {},
}) => {
  const baseUrl = "https://api-acamp.gfq513.com.br/api/v1";
  const url = buildUrl(baseUrl, path, query);
  const token = localStorage.getItem("APP_API_KEY");

  const finalHeaders = {
    ...DEFAULT_HEADERS,
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const options = { method, headers: finalHeaders };

  if (body !== undefined) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, options);
    const parsed = await parseBody(response);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: parsed || { message: "Request failed" },
      };
    }

    return { ok: true, status: response.status, data: parsed, error: null };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: { message: err?.message || "Network error" },
    };
  }
};
