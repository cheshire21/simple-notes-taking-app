import type { JSX } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <div className="flex flex-1 flex-col">{children}</div>
);

export default DashboardLayout;
