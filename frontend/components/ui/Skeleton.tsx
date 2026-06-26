import type { JSX } from "react";

import { cn } from "@/lib/utils";

const Skeleton = ({ className }: { className?: string }): JSX.Element => (
  <div className={cn("animate-pulse rounded bg-brown/15", className)} />
);

export default Skeleton;
