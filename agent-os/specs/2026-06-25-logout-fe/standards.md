# Standards for Logout FE

## frontend/auth-flow

- `useLogout` clears tokens in its `onSuccess` — component must NOT write to or clear localStorage
- After `useLogout` succeeds, call `router.push("/login")` explicitly — `useSyncExternalStore` only reacts to the `storage` event (cross-tab); same-tab localStorage removal does not trigger a re-render

## frontend/code-style

- Arrow functions only — no `function` declarations
- Double quotes everywhere
- Explicit return types: `: JSX.Element`
- No hardcoded hex — use design tokens

## frontend/testing

- MSW for HTTP interception — never mock axios directly
- `localStorage.clear()` in `afterEach`
- `vi.hoisted` to capture `mockPush` across hoist boundary
- `createWrapper` with `QueryClientProvider`, retries disabled
- Seed localStorage before tests that depend on stored tokens
