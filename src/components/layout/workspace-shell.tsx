'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileBottomNav, NavTheme } from './mobile-bottom-nav';
import { MobileDrawer } from './mobile-drawer';

interface WorkspaceShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function WorkspaceShell({ children, title, description }: WorkspaceShellProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>('dark_lime');

  useEffect(() => {
    const saved = localStorage.getItem('exoflow_mobile_nav_theme') as NavTheme;
    if (saved && (saved === 'dark_lime' || saved === 'lime_dark' || saved === 'white_dark')) {
      setNavTheme(saved);
    }
  }, []);

  const handleNavThemeChange = (newTheme: NavTheme) => {
    setNavTheme(newTheme);
    localStorage.setItem('exoflow_mobile_nav_theme', newTheme);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f6f8f5] overflow-hidden">
      <Header
        title={title}
        description={description}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      <div className="flex-1 flex min-w-0 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-3.5 py-3 sm:px-5 sm:py-5 md:p-6 lg:p-7 pb-28 md:pb-7 touch-scroll">
          <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile App Floating Bottom Pill Navigation Bar */}
      <MobileBottomNav
        theme={navTheme}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Mobile App Slide-Up Sheet Menu */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeNavTheme={navTheme}
        onNavThemeChange={handleNavThemeChange}
      />
    </div>
  );
}
