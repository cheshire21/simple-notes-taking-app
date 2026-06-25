import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

import { cn } from "@/lib/utils";

const Input = ({ className, type, ...props }: React.ComponentProps<"input">): React.JSX.Element => (
  <InputPrimitive
    type={type}
    data-slot="input"
    className={cn(
      "w-full min-w-0 rounded-lg border border-input bg-transparent px-[15px] py-3 text-black transition-colors outline-none placeholder:text-black focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
      className,
    )}
    {...props}
  />
);

export { Input };
export default Input;
