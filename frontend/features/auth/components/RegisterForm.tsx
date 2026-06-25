"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/register.schema";

const RegisterForm = (): JSX.Element => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const { mutate, isPending } = useRegister();

  const onSubmit = (values: RegisterFormValues): void => {
    mutate(values, {
      onSuccess: () => {
        router.push("/login");
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.data) {
          const data = error.response.data as Record<string, string | string[]>;
          if (data.email)
            setError("email", { message: Array.isArray(data.email) ? data.email[0] : data.email });
          if (data.password)
            setError("password", {
              message: Array.isArray(data.password) ? data.password[0] : data.password,
            });
          const general = data.detail ?? (data.non_field_errors as string[] | undefined)?.[0];
          if (general) setError("root", { message: String(general) });
        }
      },
    });
  };

  return (
    <div className="w-full max-w-xs">
      <Image
        src="/cat-register.png"
        alt="Sleeping cat"
        width={120}
        height={90}
        className="mx-auto mb-4"
      />

      <h1 className="text-3xl font-bold text-brown text-center mb-6">Yay, New Friend!</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-3">
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email address"
              error={!!errors.email}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <PasswordInput
              {...register("password")}
              placeholder="Password"
              error={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        {errors.root && (
          <p className="text-sm text-red-500 text-center mb-2 mt-3">{errors.root.message}</p>
        )}

        <div className="mt-4">
          <Button variant="outline" fullWidth type="submit" disabled={isPending}>
            {isPending ? "Signing up…" : "Sign Up"}
          </Button>
        </div>
      </form>

      <p className="text-center mt-4 text-sm">
        <Link href="/login" className="text-brown underline">
          We&apos;re already friends!
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
