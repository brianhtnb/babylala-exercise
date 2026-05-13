'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content area — offset by sidebar width on md+ */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 md:hidden flex items-center gap-3 px-4 h-14 bg-chrome-sidebar border-b border-white/8 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/8 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <span className="text-white font-semibold text-sm">Babylala Exercise</span>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
