# References for Login Page

## Similar Implementations

### RegisterForm

- **Location:** `frontend/features/auth/components/RegisterForm.tsx`
- **Relevance:** Direct template — LoginForm mirrors this exactly
- **Key patterns:** shadcn Form/FormField/FormItem/FormControl/FormMessage, useRegister mutation pattern, error handling with setError, PasswordInput usage, layout structure

### useLogin hook

- **Location:** `frontend/features/auth/hooks/useLogin.ts`
- **Relevance:** Already implemented — stores access_token + refresh_token in localStorage in onSuccess
- **Key patterns:** useMutation wrapping login(), tokens written in hook not in component

### register.schema.ts

- **Location:** `frontend/features/auth/schemas/register.schema.ts`
- **Relevance:** Schema file pattern to follow for login.schema.ts

### RegisterForm.test.tsx

- **Location:** `frontend/features/auth/components/RegisterForm.test.tsx`
- **Relevance:** Test pattern to mirror — MSW server setup, createWrapper, vi.hoisted for mockPush, all 6 test cases
