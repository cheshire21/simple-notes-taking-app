import type { JSX } from "react";

import NotesArea from "./NotesArea";
import Sidebar from "./Sidebar";

const DashboardShell = (): JSX.Element => (
  <div className="flex flex-1 bg-cream">
    <Sidebar />
    <NotesArea />
  </div>
);

export default DashboardShell;
