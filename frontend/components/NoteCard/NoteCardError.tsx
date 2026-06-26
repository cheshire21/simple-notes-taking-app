"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";

const NoteCardError = ({ onRetry }: { onRetry: () => void }): JSX.Element => (
  <div className="flex flex-1 flex-col items-center justify-center gap-3">
    <p className="text-sm text-red-400">Failed to load notes.</p>
    <Button variant="ghost" size="sm" onClick={onRetry}>
      Try again
    </Button>
  </div>
);

export default NoteCardError;
