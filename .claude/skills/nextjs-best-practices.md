# Next.js Best Practices

Complements `nextjs-architecture.md` (folder structure + layer rules) and `react-best-practices.md` (React fundamentals).
Focus: Next.js 16 App Router patterns, data fetching, routing, and performance.

---

## Server vs Client Components

The most important decision in Next.js App Router: **default to Server Components**.

| Need | Use |
|------|-----|
| Fetch data, access DB/services, read env secrets | Server Component |
| Event handlers, `useState`, `useEffect`, browser APIs | Client Component (`"use client"`) |
| Both (e.g. fetch data + interactive child) | Server parent → pass data as props to Client child |

- Add `"use client"` only at the boundary where interactivity begins — keep it as far down the tree as possible
- Never import server-only code (DB clients, secret env vars) into a Client Component — use `server-only` package to guard it

```tsx
// Server Component — no directive needed, fetches directly
const NotesPage = async (): Promise<JSX.Element> => {
  const notes = await noteList({ userId: getCurrentUserId() });
  return <NoteList notes={notes} />;
};

export default NotesPage;
```

```tsx
// Client Component — only what needs interactivity
"use client";

export const NoteList = ({ notes }: { notes: Note[] }): JSX.Element => {
  const [selected, setSelected] = useState<number | null>(null);
  ...
};
```

---

## Data Fetching

- Fetch in Server Components with `async/await` — no `useEffect` for initial data loads
- Fetch in parallel with `Promise.all` — never chain sequential awaits for independent data

```tsx
// bad — sequential, each waits for the previous
const notes = await getNotes(userId);
const categories = await getCategories(userId);

// good — parallel
const [notes, categories] = await Promise.all([
  getNotes(userId),
  getCategories(userId),
]);
```

- Use React Query (`useQuery`) in Client Components for data that needs background refetching, polling, or optimistic updates
- Use Next.js `fetch()` cache options for external HTTP calls: `{ cache: "force-cache" }` (static), `{ next: { revalidate: 60 } }` (ISR), `{ cache: "no-store" }` (dynamic)

---

## Server Actions

Use Server Actions for mutations — no need for a separate API route for form submissions.

- Always validate input server-side — a Server Action is a public endpoint
- Revalidate stale data with `revalidatePath()` or `revalidateTag()` after a write
- Return a typed result object for error handling — don't throw to the client

```tsx
// features/notes/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateNoteSchema = z.object({ title: z.string().min(1).max(255) });

export async function createNoteAction(formData: FormData) {
  const parsed = CreateNoteSchema.safeParse({ title: formData.get("title") });
  if (!parsed.success) return { error: parsed.error.flatten() };

  await noteCreate({ userId: getCurrentUserId(), ...parsed.data });
  revalidatePath("/notes");
  return { success: true };
}
```

---

## Routing

- Use **route groups** `(group)` to share layouts without adding a URL segment
- Use `layout.tsx` for persistent UI (nav, sidebar) — it does not re-render on navigation within its subtree
- Use `loading.tsx` for automatic Suspense boundaries per segment — no manual `<Suspense>` needed at the page level
- Use `error.tsx` for per-segment error boundaries — always a Client Component

```
app/
├── (auth)/             ← no URL segment, shared auth layout
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
└── (dashboard)/        ← no URL segment, shared dashboard layout
    ├── layout.tsx
    ├── notes/
    │   ├── page.tsx
    │   ├── loading.tsx ← shown while page.tsx is fetching
    │   └── error.tsx   ← shown if page.tsx throws
    └── notes/[id]/
        └── page.tsx
```

- Use `redirect()` (from `next/navigation`) in Server Components and Server Actions
- Use `useRouter().push()` only in Client Components, and only when you need imperative navigation
- Use `<Link>` for all declarative internal navigation — never a plain `<a>`

---

## URL State

Prefer URL state over `useState` for filters, search, pagination — it's bookmarkable and shareable.

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category");

  function select(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", id);
    router.push(`?${params.toString()}`);
  }
  ...
}
```

On the server, read it from `searchParams` prop:

```tsx
export default async function NotesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const notes = await getNotes({ categoryId: searchParams.category });
  ...
}
```

---

## Metadata & SEO

- Export `metadata` (static) or `generateMetadata` (dynamic) from every `page.tsx`
- Never set `<title>` or `<meta>` tags directly in JSX — use the Metadata API

```tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const note = await getNote(params.id);
  return { title: note.title };
}
```

---

## Performance

- Use `next/image` for all images — automatic optimization, lazy loading, correct sizing. Never use `<img>`
- Use `next/font` for fonts — eliminates layout shift, self-hosts automatically
- Use `next/dynamic` with `{ ssr: false }` for heavy client-only components (rich text editors, charts)

```tsx
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });
```

- Use `generateStaticParams` to pre-render dynamic routes at build time when content is known

```tsx
export async function generateStaticParams() {
  const notes = await getAllNoteIds();
  return notes.map((note) => ({ id: String(note.id) }));
}
```

---

## API Authentication & Silent Token Refresh

### Token Storage
- **Access token** — stored in Zustand (memory only). Invisible to DevTools, XSS cannot steal it. Lost on page refresh — silent refresh restores it automatically.
- **Refresh token** — stored in `localStorage`. Persists across refreshes. Acceptable trade-off since it's useless without the backend secret.

```typescript
// store/auth.ts
const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => localStorage.setItem("refresh_token", token),
  clearAuth: () => {
    localStorage.removeItem("refresh_token");
    set({ accessToken: null });
  },
}));
```

### Axios Interceptors
All API calls go through the axios instance in `lib/api.ts`. Access the Zustand store outside React using `useAuthStore.getState()`.

**Request interceptor** — attaches the access token from the Zustand store:
```typescript
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return config;
  config.headers.set("Authorization", `Bearer ${accessToken}`);
  return config;
});
```

**Response interceptor — silent token refresh:**
When the access token expires the API returns `401`. Instead of logging the user out immediately, the interceptor automatically requests a new access token using the refresh token and retries the original request — transparently, without the user noticing.

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const { data } = await axios.post("/api/auth/token/refresh/", { refresh });
        useAuthStore.getState().setAccessToken(data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
```

**Rules:**
- Use `_retry` flag to prevent infinite retry loops — a failed refresh must not trigger another refresh
- Use plain `axios.post` (not `api`) for the refresh call — using `api` would loop back into the interceptor
- On refresh failure: call `clearAuth()` to wipe both tokens and redirect to login
- Access the store outside React with `useAuthStore.getState()` — never call the hook outside a component

---

## Environment Variables

| Variable type | Naming | Available in |
|--------------|--------|-------------|
| Server secrets (DB, API keys) | `MY_SECRET` | Server only |
| Public client values | `NEXT_PUBLIC_API_URL` | Server + Client |

- Never expose server secrets via `NEXT_PUBLIC_` prefix
- Access env vars at runtime in Server Components — don't import them into Client Components

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `useEffect` + `fetch` for initial data | Server Component with `async/await` |
| Sequential `await` for independent data | `Promise.all(...)` |
| Server secrets in `NEXT_PUBLIC_` env vars | Use unprefixed vars — server-only |
| `<img>` instead of `next/image` | Always `next/image` |
| `<a>` for internal links | Always `<Link>` |
| Index as list key | Use a stable unique id |
| Business logic in `page.tsx` | Delegate to features, services, Server Actions |
| `"use client"` at the top of the tree | Push it down to the leaves |
