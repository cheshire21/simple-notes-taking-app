"use client";

import { useRouter } from "next/navigation";
import { type JSX, useEffect } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

const AuthGuard = ({ children, requireAuth }: AuthGuardProps): JSX.Element | null => {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (requireAuth && token === null) {
      router.replace("/login");
    } else if (!requireAuth && token !== null) {
      router.replace("/");
    }
  }, [token, requireAuth, router]);

  if (requireAuth && token === null) return null;
  if (!requireAuth && token !== null) return null;

  return <>{children}</>;
};

export default AuthGuard;
