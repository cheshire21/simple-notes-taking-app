import type { JSX } from "react";

import Skeleton from "@/components/ui/Skeleton";

const NoteCardSkeleton = (): JSX.Element => (
  <div
    className="p-5 h-[246px] flex flex-col gap-3"
    style={{
      borderRadius: "11px",
      border: "3px solid transparent",
      backgroundColor: "rgba(184,155,132,0.15)",
    }}
  >
    <div className="flex gap-2">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-4 w-3/4 mt-1" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

export default NoteCardSkeleton;
