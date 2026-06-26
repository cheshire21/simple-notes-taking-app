# References for Logout FE

## Similar Implementations

### useLogout hook

- **Location:** `frontend/features/auth/hooks/useLogout.ts`
- **Relevance:** Already implemented — clears both tokens in onSuccess. Component just calls mutate() and handles redirect.

### logout API function

- **Location:** `frontend/features/auth/api.ts`
- **Relevance:** Sends `POST /api/auth/logout/` with `{ refresh: localStorage.getItem("refresh_token") }`

### useLogin.test.tsx

- **Location:** `frontend/features/auth/hooks/useLogin.test.tsx`
- **Relevance:** Hook test pattern — MSW server, createWrapper, renderHook, localStorage assertions

### LoginForm.test.tsx

- **Location:** `frontend/features/auth/components/LoginForm.test.tsx`
- **Relevance:** Component test pattern — vi.hoisted for mockPush, MSW handlers, userEvent.click
