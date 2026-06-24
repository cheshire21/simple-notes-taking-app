import Link from "next/link";
import type { JSX } from "react";

const HomePage = (): JSX.Element => (
  <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
    <h1 className="text-3xl font-semibold tracking-tight">Notes App</h1>
    <p className="text-zinc-500">Organize your thoughts with notes and categories.</p>
    <div className="flex gap-4">
      <Link
        href="/login"
        className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:opacity-80"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="rounded-full border border-black/10 px-6 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
      >
        Register
      </Link>
    </div>
  </main>
);

export default HomePage;
