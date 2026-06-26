"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";

const LogoutButton = (): JSX.Element => {
  const router = useRouter();
  const { setToken } = useAuth();
  const { mutate, isPending } = useLogout();

  const handleLogout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    router.push("/login");
    mutate(undefined);
  };

  return (
    <Button variant="outline" disabled={isPending} onClick={handleLogout}>
      {isPending ? "Logging out…" : "Logout"}
    </Button>
  );
};

export default LogoutButton;
