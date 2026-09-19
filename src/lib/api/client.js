export const BASE_URL = process.env.API_URL;

let cachedBaseURL;

async function getBaseURL() {
  if (typeof window === "undefined") {
    return process.env.API_URL || "";
  }
  if (cachedBaseURL !== undefined) return cachedBaseURL;
  try {
    const res = await fetch("/api/config", { cache: "no-store" });
    const data = await res.json();
    cachedBaseURL = data.API_URL || "";
  } catch {
    cachedBaseURL = "";
  }
  return cachedBaseURL;
}

async function request(path, options = {}) {
  const baseURL = await getBaseURL();
  const res = await fetch(`${baseURL}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  return { res, data };
}

export async function apiGet(path) {
  return request(path);
}

export async function apiPost(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPatch(path, body) {
  return request(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function apiPut(path, body) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path, body) {
  return request(path, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export const BASE_URL_SERVER_ONLY = process.env.API_URL;

export { getBaseURL };