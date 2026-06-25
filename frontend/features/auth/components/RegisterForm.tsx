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
import { useRegister } from "@/features/auth/hooks/useRegister";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/register.schema";

const RegisterForm = (): JSX.Element => {
  const router = useRouter();
  const form = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const { mutate, isPending } = useRegister();

  const onSubmit = (values: RegisterFormValues): void => {
    mutate(values, {
      onSuccess: () => router.push("/login"),
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
        src="/cat-register.png"
        alt="Sleeping cat"
        width={188}
        height={134}
        className="mx-auto mb-4"
      />
      <h1 className="text-5xl font-bold text-brown text-center mb-9">Yay, New Friend!</h1>

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
            {isPending ? "Signing up…" : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-center mt-4 text-xs font-normal">
        <Link href="/login" className="text-brown underline">
          We&apos;re already friends!
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
