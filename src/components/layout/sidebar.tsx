'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  CheckSquare,
  FolderKanban,
  ListTodo,
  CalendarDays,
  FileText,
  Users,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout, allProfiles, switchProfile } = useAuth();
  const { notifications } = useData();

  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const unreadNotifsCount = notifications.filter((n) => !n.is_read && n.user_id === user?.id).length;

  const mainNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    ...(isAdmin ? [] : [{ label: 'My Tasks', href: '/my-tasks', icon: CheckSquare }]),
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: isAdmin ? 'Tasks Management' : 'All Tasks', href: '/tasks', icon: ListTodo },
    { label: 'Meetings', href: '/meetings', icon: CalendarDays },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Team', href: '/team', icon: Users },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
    },
  ];

  const bottomNavItems = [
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex my-4 ml-4 flex-col justify-between shrink-0 select-none z-30">
      {/* Top Floating Pill Dock (Navigation) */}
      <div className="w-[66px] bg-white rounded-[32px] p-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col items-center gap-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <div key={item.href} className="relative group flex items-center justify-center">
              <Link
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'w-11 h-11 rounded-full bg-neutral-950 text-[#d4f940] shadow-sm'
                    : 'w-10 h-10 rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100/90'
                }`}
                aria-label={item.label}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-[#d4f940]' : 'text-neutral-500'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.75}
                />

                {item.badge && !isActive && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d4f940] ring-2 ring-white" />
                )}
              </Link>

              {/* Floating Tooltip Pill */}
              <div className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-neutral-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl flex items-center gap-1.5">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-[#d4f940] text-neutral-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Pill Dock (Settings, Profile Switcher & Logout) */}
      <div className="w-[66px] bg-white rounded-[32px] p-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col items-center gap-2 mt-4">
        {/* Settings */}
        <div className="relative group flex items-center justify-center">
          <Link
            href="/settings"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              pathname === '/settings'
                ? 'bg-neutral-950 text-[#d4f940]'
                : 'text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100/90'
            }`}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
          </Link>
          <div className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center z-50">
            <div className="bg-neutral-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl">
              Settings
            </div>
          </div>
        </div>

        {/* Profile / Role Switcher Trigger */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100/90 transition-all cursor-pointer"
            aria-label="Switch User Role"
          >
            <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <div className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center z-50">
            <div className="bg-neutral-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl">
              Switch Test Role ({isAdmin ? 'Admin' : 'Employee'})
            </div>
          </div>

          {/* Profile Switcher Popover */}
          {showProfileSwitcher && (
            <div className="absolute bottom-0 left-full ml-3 w-64 bg-white rounded-3xl shadow-2xl border border-neutral-200/80 p-3 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
              <div className="px-2 py-1.5 text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
                Switch Test Role
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {allProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProfile(p.id);
                      setShowProfileSwitcher(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-2xl text-left text-xs transition-all cursor-pointer ${
                      p.id === user?.id
                        ? 'bg-neutral-100 font-bold text-neutral-950 ring-1 ring-neutral-300'
                        : 'hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={p.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">{p.full_name}</span>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        p.role === 'admin'
                          ? 'bg-neutral-950 text-white'
                          : 'bg-[#d4f940] text-neutral-950'
                      }`}
                    >
                      {p.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={logout}
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <div className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center z-50">
            <div className="bg-neutral-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl">
              Sign Out
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
