'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CheckSquare,
  ListTodo,
  FolderKanban,
  CalendarDays,
  Menu,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';

export type NavTheme = 'dark_lime' | 'lime_dark' | 'white_dark';

interface MobileBottomNavProps {
  onOpenDrawer: () => void;
  theme?: NavTheme;
  onThemeChange?: (theme: NavTheme) => void;
}

export function MobileBottomNav({
  onOpenDrawer,
  theme = 'dark_lime',
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const { notifications, tasks } = useData();

  const [activeTheme, setActiveTheme] = useState<NavTheme>(theme);

  useEffect(() => {
    const saved = localStorage.getItem('exoflow_mobile_nav_theme') as NavTheme;
    if (saved && (saved === 'dark_lime' || saved === 'lime_dark' || saved === 'white_dark')) {
      setActiveTheme(saved);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read && n.user_id === user?.id).length;
  const blockedTasksCount = tasks.filter((t) => t.status === 'blocked').length;

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/dashboard',
      icon: Home,
      isActive: pathname === '/dashboard',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      href: isAdmin ? '/tasks' : '/my-tasks',
      icon: isAdmin ? ListTodo : CheckSquare,
      badge: blockedTasksCount > 0 ? blockedTasksCount : undefined,
      badgeColor: 'bg-red-500 text-white',
      isActive: pathname === '/tasks' || pathname === '/my-tasks',
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      icon: FolderKanban,
      isActive: pathname === '/projects' || pathname.startsWith('/projects/'),
    },
    {
      id: 'meetings',
      label: 'Meetings',
      href: '/meetings',
      icon: CalendarDays,
      isActive: pathname === '/meetings',
    },
  ];

  const isMoreActive =
    pathname === '/reports' ||
    pathname === '/team' ||
    pathname === '/analytics' ||
    pathname === '/notifications' ||
    pathname === '/settings';

  // Theme styling definitions matching the reference image variants:
  // 1. dark_lime (Variant 3): Black rounded container, Lime active pill, Lime inactive icons
  // 2. lime_dark (Variant 2): Lime rounded container, Black active pill, Black inactive icons
  // 3. white_dark (Variant 1): White rounded container, Black active pill, Black inactive icons
  const themeStyles = {
    dark_lime: {
      container:
        'bg-[#121212]/95 backdrop-blur-xl border border-neutral-800/80 shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
      activePill:
        'bg-[#d4f940] text-neutral-950 font-black shadow-[0_2px_10px_rgba(212,249,64,0.35)]',
      activeIcon: 'text-neutral-950',
      activeText: 'text-neutral-950',
      inactiveIcon: 'text-[#d4f940] hover:text-white',
      badgeRing: 'ring-[#121212]',
    },
    lime_dark: {
      container:
        'bg-[#d4f940] border border-[#c1e828] shadow-[0_16px_40px_rgba(212,249,64,0.35)]',
      activePill:
        'bg-neutral-950 text-[#d4f940] font-black shadow-[0_2px_10px_rgba(0,0,0,0.3)]',
      activeIcon: 'text-[#d4f940]',
      activeText: 'text-[#d4f940]',
      inactiveIcon: 'text-neutral-950 hover:text-neutral-800',
      badgeRing: 'ring-[#d4f940]',
    },
    white_dark: {
      container:
        'bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.12)]',
      activePill:
        'bg-neutral-950 text-[#d4f940] font-black shadow-[0_2px_10px_rgba(0,0,0,0.2)]',
      activeIcon: 'text-[#d4f940]',
      activeText: 'text-white',
      inactiveIcon: 'text-neutral-800 hover:text-neutral-950',
      badgeRing: 'ring-white',
    },
  }[activeTheme];

  return (
    <nav
      aria-label="Mobile Floating Navigation"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center justify-center pointer-events-auto select-none"
    >
      {/* Floating Pill Dock matching user reference */}
      <div
        className={`flex items-center gap-1.5 p-1.5 rounded-full transition-all duration-300 ${themeStyles.container}`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isActive) {
            // Expanding Active Capsule Pill: [ (icon) Label ]
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition-all duration-300 active:scale-95 cursor-pointer shrink-0 ${themeStyles.activePill}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${themeStyles.activeIcon}`} strokeWidth={2.5} />
                <span className={`tracking-tight leading-none ${themeStyles.activeText}`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          // Inactive Circular Icon Button
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-90 cursor-pointer ${themeStyles.inactiveIcon}`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={2} />

              {item.badge && (
                <span
                  className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${item.badgeColor} ring-2 ${themeStyles.badgeRing}`}
                />
              )}
            </Link>
          );
        })}

        {/* More / Menu Drawer Trigger */}
        {isMoreActive ? (
          <button
            onClick={onOpenDrawer}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition-all duration-300 active:scale-95 cursor-pointer shrink-0 ${themeStyles.activePill}`}
            aria-label="More Options"
          >
            <Menu className={`w-4 h-4 shrink-0 ${themeStyles.activeIcon}`} strokeWidth={2.5} />
            <span className={`tracking-tight leading-none ${themeStyles.activeText}`}>More</span>
          </button>
        ) : (
          <button
            onClick={onOpenDrawer}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-90 cursor-pointer ${themeStyles.inactiveIcon}`}
            aria-label="More Navigation Options"
            title="More Options"
          >
            <Menu className="w-4.5 h-4.5 shrink-0" strokeWidth={2} />

            {unreadCount > 0 && (
              <span
                className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#d4f940] ring-2 ${themeStyles.badgeRing}`}
              />
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
