import Image from "next/image";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";

const NotesArea = (): JSX.Element => (
  <div className="flex flex-1 flex-col">
    <div className="flex justify-end p-6">
      <Button variant="outline" className="rounded-full gap-1.5">
        + New Note
      </Button>
    </div>
    <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16">
      <Image src="/boba-empty.png" alt="No notes yet" width={297} height={297} />
      <p className="text-brown font-sans font-normal text-2xl text-center">
        I&apos;m just here waiting for your charming notes...
      </p>
    </div>
  </div>
);

export default NotesArea;
