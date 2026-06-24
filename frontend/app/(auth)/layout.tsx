import type { JSX } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <div className="flex flex-1 flex-col items-center justify-center p-8">{children}</div>
);

export default AuthLayout;
