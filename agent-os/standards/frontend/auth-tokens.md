# Authentication & Token Handling

## Token Storage

Both tokens are stored in `localStorage`. No cookies, no Zustand, no React state.

| Token | Key | Lifetime |
|-------|-----|---------|
| Access token | `access_token` | 15 minutes |
| Refresh token | `refresh_token` | 7 days |

```ts
localStorage.setItem("access_token", data.access);
localStorage.setItem("refresh_token", data.refresh);
```

On logout: `localStorage.removeItem("access_token")` and `localStorage.removeItem("refresh_token")`.

## Axios Instance (`lib/api.ts`)

All API calls go through the single axios instance. Never use raw `fetch` or `axios` directly.

**Request interceptor** — attaches access token to every request:

```ts
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) return config;
  config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});
```

**Response interceptor — silent refresh:**

When a request returns 401, automatically refresh the access token and retry the original request. The user never sees a login redirect unless the refresh token itself is expired.

```ts
interface RetryableRequest extends AxiosRequestConfig {
  retried?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: RetryableRequest = error.config;
    if (error.response?.status === 401 && !original.retried) {
      original.retried = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`,
          { refresh },
        );
        localStorage.setItem("access_token", data.access);
        const retryConfig = { ...original, headers: { Authorization: `Bearer ${data.access}` } };
        return await api(retryConfig);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
```

## Rules

- `retried` flag (not `_retry`) prevents infinite retry loops — ESLint no-underscore-dangle
- Use plain `axios.post` (not `api`) for the refresh call — using `api` would re-trigger the interceptor
- On refresh failure: clear both tokens, redirect to `/login`
- Never read tokens in components — the axios interceptor handles it automatically
