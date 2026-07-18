"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Toaster } from "./toaster";

export function AdminShell({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-950">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}