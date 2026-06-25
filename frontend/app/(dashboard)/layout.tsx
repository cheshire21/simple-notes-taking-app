import type { JSX } from "react";

import AuthGuard from "@/features/auth/components/AuthGuard";

const DashboardLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <AuthGuard requireAuth>
    <div className="flex flex-1 flex-col">{children}</div>
  </AuthGuard>
);

export default DashboardLayout;
