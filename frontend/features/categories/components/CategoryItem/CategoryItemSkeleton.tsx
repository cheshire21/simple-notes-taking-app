import type { JSX } from "react";

import Skeleton from "@/components/ui/Skeleton";

const CategoryItemSkeleton = (): JSX.Element => (
  <div className="flex items-center gap-2">
    <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />
    <Skeleton className="h-3 w-24" />
  </div>
);

export default CategoryItemSkeleton;
