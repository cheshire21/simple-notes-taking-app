"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/PasswordInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";

const LoginForm = (): JSX.Element => {
  const router = useRouter();
  const { setToken } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate, isPending } = useLogin();

  const onSubmit = (values: LoginFormValues): void => {
    mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        setToken(data.access);
        router.push("/");
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.data) {
          const data = error.response.data as Record<string, string | string[]>;
          if (data.email)
            form.setError("email", {
              message: Array.isArray(data.email) ? data.email[0] : String(data.email),
            });
          if (data.password)
            form.setError("password", {
              message: Array.isArray(data.password) ? data.password[0] : String(data.password),
            });
          const general = data.detail ?? (data.non_field_errors as string[] | undefined)?.[0];
          if (general) form.setError("root", { message: String(general) });
        }
      },
    });
  };

  return (
    <div className="w-full max-w-sm">
      <Image
        src="/cactus-login.png"
        alt="Cactus"
        width={188}
        height={134}
        className="mx-auto mb-4"
      />
      <h1 className="text-5xl font-bold text-brown text-center mb-9">Yay, You&apos;re Back!</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-3">
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
                  <PasswordInput placeholder="Password" {...field} />
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

          <Button
            type="submit"
            variant="outline"
            className="w-full rounded-full mt-9"
            disabled={isPending}
          >
            {isPending ? "Logging in…" : "Login"}
          </Button>
        </form>
      </Form>

      <p className="text-center mt-4 text-xs font-normal">
        <Link href="/register" className="text-brown underline">
          Oops! I&apos;ve never been here before
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
