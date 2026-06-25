# Frontend Forms

## Stack

All forms use **react-hook-form** + **zod** + **shadcn Form components**. Never hand-roll validation with `useState`.

Installed packages: `react-hook-form`, `@hookform/resolvers`, `zod`.

## Hard Rules

- Every form uses `useForm` + `zodResolver` — no exceptions
- Every schema lives in `features/<feature>/schemas/<name>.schema.ts` — never inline in the component
- Always render fields with shadcn `Form / FormField / FormItem / FormControl / FormMessage`
- Never use raw `<input>` elements or manual `{errors.x && <p>}` blocks in forms
- API field errors → `form.setError("fieldName", { message })` — never separate state
- General API errors → `form.setError("root", { message })` — render via `form.formState.errors.root`
- Disable submit while `isPending` to prevent double-submit

## Schema File

```
features/auth/
├── components/
│   └── RegisterForm.tsx      ← imports schema
└── schemas/
    └── register.schema.ts    ← schema + inferred type
```

```ts
// features/auth/schemas/register.schema.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
```

## Form Component

```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/register.schema";

const RegisterForm = (): JSX.Element => {
  const router = useRouter();
  const { mutate, isPending } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: RegisterFormValues): void => {
    mutate(values, {
      onSuccess: () => router.push("/login"),
      onError: (error) => {
        if (isAxiosError(error) && error.response?.data) {
          const data = error.response.data as Record<string, string[]>;
          if (data.email) form.setError("email", { message: data.email[0] });
          if (data.password) form.setError("password", { message: data.password[0] });
          const general = data.detail ?? data.non_field_errors?.[0];
          if (general) form.setError("root", { message: Array.isArray(general) ? general[0] : general });
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive text-center">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading…" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
```
