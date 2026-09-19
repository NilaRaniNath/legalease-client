export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
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

export const BASE_URL_SERVER_ONLY = process.env.NEXT_PUBLIC_API_URL;