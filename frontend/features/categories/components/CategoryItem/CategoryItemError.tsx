import type { JSX } from "react";

const CategoryItemError = ({ onRetry }: { onRetry: () => void }): JSX.Element => (
  <div className="flex flex-col gap-1">
    <p className="text-xs text-red-400">Failed to load categories.</p>
    <button type="button" onClick={onRetry} className="text-xs text-brown underline text-left">
      Try again
    </button>
  </div>
);

export default CategoryItemError;
