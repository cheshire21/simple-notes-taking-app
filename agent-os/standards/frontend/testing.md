# Frontend Testing

## Stack

Vitest + React Testing Library + MSW. Config in `vitest.config.ts`, setup in `src/test/setup.ts`.

## localStorage polyfill

Node.js 22+ defines `globalThis.localStorage` as `undefined` (non-configurable) unless `--localstorage-file` is passed. jsdom cannot override it. `src/test/setup.ts` patches it before any test runs.

**Do not add localStorage mocks in individual tests** — the polyfill handles it globally. Just call `localStorage.clear()` in `afterEach`.

```ts
afterEach(() => localStorage.clear());
```

## MSW setup

Use MSW to intercept HTTP — never mock axios or API modules directly.

```ts
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

- `onUnhandledRequest: "error"` catches missing handlers early
- Override per test with `server.use(...)` for error cases

## Hook tests

Wrap with `QueryClientProvider`. Always disable retries.

```ts
const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });
```

## Component tests — Next.js mocks

Declare per test file (not in setup.ts):

```ts
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));
```

For capturing the mock across the hoist boundary, use `vi.hoisted`:

```ts
const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
```

## Query priority

`getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId` (last resort)

## Co-location

Test files live next to the file they test:
- `hooks/useRegister.ts` → `hooks/useRegister.test.tsx`
- `components/RegisterForm.tsx` → `components/RegisterForm.test.tsx`
