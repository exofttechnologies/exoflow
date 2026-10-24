'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Users,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Shield,
  User,
  Megaphone,
  CheckSquare,
  ListTodo,
  CalendarDays,
  FolderKanban,
  LayoutGrid,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import type { NavTheme } from './mobile-bottom-nav';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAnnouncements?: () => void;
  activeNavTheme?: NavTheme;
  onNavThemeChange?: (theme: NavTheme) => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  onOpenAnnouncements,
  activeNavTheme = 'dark_lime',
  onNavThemeChange,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const { user, isAdmin, logout, allProfiles, switchProfile } = useAuth();
  const { notifications } = useData();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.is_read && n.user_id === user?.id).length;

  const drawerNavLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid, desc: 'Overview & daily focus' },
    {
      label: isAdmin ? 'All Tasks' : 'My Tasks',
      href: isAdmin ? '/tasks' : '/my-tasks',
      icon: isAdmin ? ListTodo : CheckSquare,
      desc: isAdmin ? 'Manage sprint deliverables' : 'Your personal assignments',
    },
    { label: 'Projects', href: '/projects', icon: FolderKanban, desc: 'Milestones & roadmap' },
    { label: 'Meetings', href: '/meetings', icon: CalendarDays, desc: 'Tuesday reviews & syncs' },
    { label: 'Reports', href: '/reports', icon: FileText, desc: 'Weekly progress & logs' },
    { label: 'Team', href: '/team', icon: Users, desc: 'Directory & workloads' },
    { label: 'Analytics', href: '/analytics', icon: BarChart3, desc: 'Throughput & velocity' },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: Bell,
      desc: 'System alerts & feedback',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Settings', href: '/settings', icon: Settings, desc: 'Workspace configuration' },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Surface */}
      <div className="relative w-full max-h-[88vh] bg-white rounded-t-[32px] border-t border-neutral-200/80 shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
        {/* Pull Handle & Header */}
        <div className="pt-3 pb-2 px-5 border-b border-neutral-100 shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-neutral-300 mx-auto mb-3" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.full_name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-200 shadow-2xs"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-neutral-950 truncate">
                    {user?.full_name}
                  </h3>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      isAdmin ? 'bg-neutral-950 text-[#d4f940]' : 'bg-[#d4f940] text-neutral-950'
                    }`}
                  >
                    {isAdmin ? 'Admin' : 'Staff'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium truncate">
                  {user?.designation || user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 touch-scroll">
          {/* Quick Role Toggle Bar */}
          <div className="bg-neutral-50 rounded-2xl p-2.5 border border-neutral-200/80 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Active Role
              </span>
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="text-[11px] font-bold text-neutral-900 hover:underline cursor-pointer"
              >
                {showRoleSwitcher ? 'Done' : 'Switch demo user'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => switchProfile(allProfiles[0].id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white text-neutral-700 border border-neutral-200/90'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Mode</span>
              </button>

              <button
                onClick={() => switchProfile(allProfiles[2].id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isAdmin
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white text-neutral-700 border border-neutral-200/90'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Staff Mode</span>
              </button>
            </div>

            {/* Quick Demo Switcher list */}
            {showRoleSwitcher && (
              <div className="pt-2 border-t border-neutral-200/70 space-y-1.5 max-h-48 overflow-y-auto">
                <div className="text-[10px] text-neutral-400 font-semibold px-1">
                  Tap to sign in as any team member:
                </div>
                {allProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProfile(p.id);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      p.id === user?.id
                        ? 'bg-neutral-200/80 font-bold text-neutral-950'
                        : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={p.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <div className="truncate">
                        <div className="font-bold text-xs leading-none">{p.full_name}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{p.designation}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
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
            )}
          </div>

          {/* Floating Pill Dock Theme Selector (Matching User Reference Image) */}
          <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200/80 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                Nav Bar Style
              </span>
              <span className="text-[10px] font-bold text-neutral-400">Reference Styles</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Option 3 from image: Dark + Lime */}
              <button
                type="button"
                onClick={() => onNavThemeChange && onNavThemeChange('dark_lime')}
                className={`p-2.5 rounded-xl bg-[#121212] text-[#d4f940] flex flex-col items-center justify-center gap-1 border shadow-xs cursor-pointer active:scale-95 transition-all ${
                  activeNavTheme === 'dark_lime'
                    ? 'ring-2 ring-neutral-950 border-[#d4f940]'
                    : 'border-neutral-800 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4f940]" />
                  <span className="text-[10px] font-black text-white">Dark + Lime</span>
                </div>
                <span className="text-[9px] text-[#d4f940] font-semibold">Variant 3 (Default)</span>
              </button>

              {/* Option 2 from image: Lime + Dark */}
              <button
                type="button"
                onClick={() => onNavThemeChange && onNavThemeChange('lime_dark')}
                className={`p-2.5 rounded-xl bg-[#d4f940] text-neutral-950 flex flex-col items-center justify-center gap-1 border shadow-xs cursor-pointer active:scale-95 transition-all ${
                  activeNavTheme === 'lime_dark'
                    ? 'ring-2 ring-neutral-950 border-neutral-950'
                    : 'border-[#c2ea2f] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-950" />
                  <span className="text-[10px] font-black text-neutral-950">Lime & Dark</span>
                </div>
                <span className="text-[9px] text-neutral-800 font-semibold">Variant 2</span>
              </button>

              {/* Option 1 from image: White + Dark */}
              <button
                type="button"
                onClick={() => onNavThemeChange && onNavThemeChange('white_dark')}
                className={`p-2.5 rounded-xl bg-white text-neutral-950 flex flex-col items-center justify-center gap-1 border shadow-xs cursor-pointer active:scale-95 transition-all ${
                  activeNavTheme === 'white_dark'
                    ? 'ring-2 ring-neutral-950 border-neutral-400'
                    : 'border-neutral-200 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-black text-neutral-900">White & Blue</span>
                </div>
                <span className="text-[9px] text-neutral-500 font-semibold">Variant 1</span>
              </button>
            </div>
          </div>

          {/* Announcements Pill Trigger */}
          {onOpenAnnouncements && (
            <button
              onClick={() => {
                onClose();
                onOpenAnnouncements();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 text-white cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#d4f940] text-neutral-950 flex items-center justify-center font-bold">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-white group-hover:text-[#d4f940] transition-colors">
                    Company Notices & Alerts
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Live broadcasts & sprint warnings
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          )}

          {/* Full Navigation Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
              Workspace Navigation
            </div>

            {drawerNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-950 text-white font-bold shadow-xs'
                      : 'hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-white/10 text-[#d4f940]'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isActive ? 'text-neutral-400' : 'text-neutral-400'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="bg-[#d4f940] text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 ${isActive ? 'text-neutral-400' : 'text-neutral-300'}`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sign Out Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Exoft Flow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
