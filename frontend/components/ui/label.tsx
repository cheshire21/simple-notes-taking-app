import * as React from "react";

import { cn } from "@/lib/utils";

const Label = ({
  className,
  htmlFor,
  ...props
}: React.ComponentProps<"label">): React.JSX.Element => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label
    data-slot="label"
    htmlFor={htmlFor}
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

export { Label };
export default Label;
