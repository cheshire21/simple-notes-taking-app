import type { JSX } from "react";

import LogoutButton from "@/features/auth/components/LogoutButton";

const PLACEHOLDER_CATEGORIES = [
  { name: "Random Thoughts", color: "bg-[#E8735A]" },
  { name: "School", color: "bg-[#F0C05A]" },
  { name: "Personal", color: "bg-[#5AACB8]" },
];

const Sidebar = (): JSX.Element => (
  <aside className="hidden md:flex w-52 flex-col pt-8 px-6">
    <p className="text-sm font-bold text-brown mb-3">All Categories</p>
    <ul className="flex flex-col gap-2">
      {PLACEHOLDER_CATEGORIES.map((cat) => (
        <li key={cat.name} className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
          <span className="text-sm text-brown">{cat.name}</span>
        </li>
      ))}
    </ul>
    <div className="mt-auto mb-6">
      <LogoutButton />
    </div>
  </aside>
);

export default Sidebar;
