# Standards for Login Page

The following standards apply to this work.

---

## frontend/forms

All forms use **react-hook-form** + **zod** + **shadcn Form components**.

- Every form uses `useForm` + `zodResolver`
- Schema in `features/<feature>/schemas/<name>.schema.ts`
- Always use `Form / FormField / FormItem / FormControl / FormMessage`
- API field errors → `form.setError("fieldName", { message })`
- General errors → `form.setError("root", { message })`
- Disable submit while `isPending`

---

## frontend/auth-flow

- `useLogin` stores tokens in its `onSuccess` — component must NOT write to localStorage
- `AuthGuard requireAuth={false}` in `(auth)/layout.tsx` automatically redirects authenticated users away — no guard logic needed in the form
- On success: `router.push("/dashboard/notes")`

---

## frontend/code-style

- Arrow functions only — no `function` declarations
- Double quotes everywhere
- Explicit return types on all components: `: JSX.Element`
- No hardcoded hex — use design tokens (`text-brown`, `text-foreground`)

---

## frontend/testing

- MSW for HTTP interception — never mock axios directly
- `localStorage.clear()` in `afterEach`
- `vi.hoisted` to capture `mockPush` across hoist boundary
- `createWrapper` with `QueryClientProvider`, retries disabled
- Query priority: `getByRole` > `getByPlaceholderText` > `getByText`
