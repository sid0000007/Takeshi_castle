import type { PropsWithChildren } from "react";

import { Sidebar } from "./Sidebar.js";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-transparent text-[var(--text-strong)] lg:h-screen lg:overflow-hidden">
      <Sidebar />
      <main className="min-w-0 flex-1 lg:ml-[280px] lg:h-screen lg:overflow-y-auto">
        <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">{children}</div>
      </main>
    </div>
  );
}
