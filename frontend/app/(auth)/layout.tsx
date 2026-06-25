import type { JSX } from "react";

import AuthGuard from "@/features/auth/components/AuthGuard";

const AuthLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <AuthGuard requireAuth={false}>
    <div className="flex flex-1 flex-col items-center justify-center p-8">{children}</div>
  </AuthGuard>
);

export default AuthLayout;
