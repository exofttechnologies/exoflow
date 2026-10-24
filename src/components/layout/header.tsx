'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ArrowUpRight,
  Shield,
  User,
  Megaphone,
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ExoftLogo } from '@/components/brand/logo';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { CircleButton, PillButton } from '@/components/ui/button';
import { Announcement } from '@/types/database';

interface HeaderNoticeItem {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'alert' | 'warning' | 'milestone' | 'notification' | 'update';
  link?: string;
  author?: string;
  time?: string;
}

export function Header({
  title,
  description,
  onOpenMobileDrawer,
}: {
  title?: string;
  description?: string;
  onOpenMobileDrawer?: () => void;
}) {
  const router = useRouter();
  const { user, isAdmin, switchProfile, allProfiles } = useAuth();
  const {
    notifications,
    announcements,
    tasks,
    createAnnouncement,
    deleteAnnouncement,
  } = useData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);
  const [modalFilter, setModalFilter] = useState<'all' | 'announcements' | 'alerts' | 'notifications'>('all');

  // New announcement form state (Admin only)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'announcement' | 'alert' | 'milestone' | 'update'>('announcement');
  const [newLink, setNewLink] = useState('');

  const unreadCount = notifications.filter((n) => !n.is_read && n.user_id === user?.id).length;

  // Build unified list of important things, announcements, and notifications
  const noticeItems: HeaderNoticeItem[] = [];

  // 1. High-Priority Admin Warning Alerts on Tasks
  tasks
    .filter((t) => Boolean(t.warning_alert))
    .forEach((t) => {
      noticeItems.push({
        id: `warn-${t.id}`,
        title: `⚠️ Admin Warning: ${t.title}`,
        content: t.warning_alert || 'Immediate action required on this deliverable.',
        category: 'warning',
        link: '/tasks',
        author: 'Executive Leadership',
        time: t.updated_at,
      });
    });

  // 2. Active Blocker Alerts on Tasks
  tasks
    .filter((t) => t.status === 'blocked')
    .forEach((t) => {
      noticeItems.push({
        id: `block-${t.id}`,
        title: `🚨 Blocker Alert: ${t.title}`,
        content: t.blocker_description || 'Deliverable is blocked and needs resolution.',
        category: 'alert',
        link: '/tasks',
        author: 'Task Assignee',
        time: t.updated_at,
      });
    });

  // 3. Company Announcements from DataContext
  (announcements || []).forEach((a) => {
    noticeItems.push({
      id: a.id,
      title: a.title,
      content: a.content,
      category: a.category,
      link: a.link || '/projects',
      author: a.author_name,
      time: a.created_at,
    });
  });

  // 4. Live Unread Notifications for Current User
  notifications
    .filter((n) => !n.is_read && n.user_id === user?.id)
    .slice(0, 3)
    .forEach((n) => {
      noticeItems.push({
        id: `notif-${n.id}`,
        title: `🔔 ${n.title}`,
        content: n.message,
        category: 'notification',
        link: n.link || '/notifications',
        author: 'System Notification',
        time: n.created_at,
      });
    });

  // Fallback if empty
  if (noticeItems.length === 0) {
    noticeItems.push({
      id: 'default-announcement',
      title: 'Exoft Flow Operating at Peak Velocity',
      content: '91% on-time deadline achievement rate reached across active company tracks.',
      category: 'milestone',
      link: '/reports',
      author: 'Exoft Technologies',
    });
  }

  // Auto-rotate announcement pill every 5.5s unless paused
  useEffect(() => {
    if (isPaused || noticeItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % noticeItems.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, noticeItems.length]);

  const activeItem = noticeItems[currentIndex % noticeItems.length];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + noticeItems.length) % noticeItems.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % noticeItems.length);
  };

  const handlePillClick = () => {
    setShowAnnouncementsModal(true);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeItem.link) {
      router.push(activeItem.link);
    } else {
      setShowAnnouncementsModal(true);
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createAnnouncement({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      link: newLink.trim() || undefined,
      is_pinned: true,
    });

    setNewTitle('');
    setNewContent('');
    setNewLink('');
    setShowCreateForm(false);
  };

  // Badge stylings based on category
  const renderCategoryBadge = (category: HeaderNoticeItem['category']) => {
    switch (category) {
      case 'warning':
      case 'alert':
        return (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-black text-[10px] uppercase tracking-wider shrink-0">
            <AlertTriangle className="w-3 h-3 text-neutral-950" />
            <span>Alert</span>
          </div>
        );
      case 'milestone':
        return (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4f940] text-neutral-950 font-black text-[10px] uppercase tracking-wider shrink-0">
            <Award className="w-3 h-3 text-neutral-950" />
            <span>Milestone</span>
          </div>
        );
      case 'notification':
        return (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-neutral-950 font-black text-[10px] uppercase tracking-wider shrink-0">
            <Bell className="w-3 h-3 text-neutral-950" />
            <span>Notification</span>
          </div>
        );
      case 'update':
        return (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-300 text-neutral-950 font-black text-[10px] uppercase tracking-wider shrink-0">
            <Sparkles className="w-3 h-3 text-neutral-950" />
            <span>Update</span>
          </div>
        );
      case 'announcement':
      default:
        return (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4f940] text-neutral-950 font-black text-[10px] uppercase tracking-wider shrink-0">
            <Megaphone className="w-3 h-3 text-neutral-950" />
            <span>Notice</span>
          </div>
        );
    }
  };

  return (
    <>
      <header className="h-18 sm:h-20 bg-transparent px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0 select-none border-none">
        {/* Left: Brand Icon Logo (Kept cleanly) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group" title="Exoft Flow — Dashboard">
            <ExoftLogo size="md" />
          </Link>
        </div>

        {/* Center: Flat Pill for Important Things, Announcements & Notifications (No Shadow) */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={handlePillClick}
          className="flex-1 max-w-3xl mx-3 sm:mx-6 hidden md:flex items-center justify-between bg-neutral-950 text-white rounded-full p-1.5 shadow-none border border-neutral-900/90 relative cursor-pointer hover:border-neutral-700 transition-all group"
          title="Click to view all company announcements and notifications"
        >
          {/* Left: Category Badge & Mini Tag */}
          <div className="flex items-center gap-2 pl-2 shrink-0">
            {renderCategoryBadge(activeItem.category)}
          </div>

          {/* Center: Dynamic Announcement/Notification Content (Animated Headline) */}
          <div className="flex-1 flex items-center justify-start px-3 min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 truncate">
              <span className="font-extrabold text-xs text-white group-hover:text-[#d4f940] transition-colors truncate">
                {activeItem.title}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium truncate hidden lg:inline">
                • {activeItem.content}
              </span>
            </div>
          </div>

          {/* Right Controls: Item Index, Prev/Next Arrows & Open Action Button */}
          <div className="flex items-center gap-1 shrink-0 pr-1">
            {/* Index Counter Pill */}
            <div className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-400">
              {currentIndex + 1}/{noticeItems.length}
            </div>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="w-6 h-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Previous Notice"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-6 h-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Next Notice"
            >
              <ChevronRight className="w-3 h-3" />
            </button>

            {/* Open / Action Circular Button with ArrowUpRight */}
            <button
              onClick={handleActionClick}
              className="w-7 h-7 rounded-full bg-neutral-900 hover:bg-[#d4f940] hover:text-neutral-950 text-[#d4f940] flex items-center justify-center transition-all cursor-pointer ml-0.5"
              title="Open Details"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Controls: Role Switcher, Notification Bell & Profile Avatar (Kept cleanly) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop Dual Role Switcher Pill */}
          <div className="hidden md:flex items-center bg-white p-0.5 rounded-full text-xs font-bold shadow-xs border border-neutral-200">
            <button
              onClick={() => switchProfile(allProfiles[0].id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-neutral-950 text-white shadow-2xs font-extrabold'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
              title="Switch to Admin mode"
            >
              <Shield className="w-2.5 h-2.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => switchProfile(allProfiles[2].id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                !isAdmin
                  ? 'bg-neutral-950 text-white shadow-2xs font-extrabold'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
              title="Switch to Employee mode"
            >
              <User className="w-2.5 h-2.5" />
              <span>Staff</span>
            </button>
          </div>

          {/* Mobile Single Tap Role Toggle */}
          <button
            onClick={() => switchProfile(isAdmin ? allProfiles[2].id : allProfiles[0].id)}
            className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200/90 text-[10px] font-black text-neutral-900 shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Tap to switch between Admin & Staff"
          >
            {isAdmin ? (
              <>
                <Shield className="w-2.5 h-2.5 text-neutral-950" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <User className="w-2.5 h-2.5 text-neutral-950" />
                <span>Staff</span>
              </>
            )}
          </button>

          {/* Circular Notification Bell */}
          <Link href="/notifications" className="relative" title="Notifications">
            <CircleButton variant="white" size="sm" className="sm:w-10 sm:h-10">
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-800" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#d4f940] ring-2 ring-white" />
              )}
            </CircleButton>
          </Link>

          {/* User Avatar (Triggers Mobile Drawer on Mobile, or Links to /team on Desktop) */}
          {onOpenMobileDrawer ? (
            <button
              onClick={onOpenMobileDrawer}
              className="md:hidden cursor-pointer"
              title="Open Navigation Menu"
            >
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.full_name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs active:scale-95 transition-transform"
              />
            </button>
          ) : (
            <Link href="/team" title="Profile Details" className="md:hidden">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.full_name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
            </Link>
          )}

          <Link href="/team" title="Profile Details" className="hidden md:block">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.full_name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs"
            />
          </Link>
        </div>
      </header>

      {/* Mobile Announcement Bar (Compact Ticker Pill) */}
      <div className="md:hidden px-4 pb-2.5">
        <div
          onClick={handlePillClick}
          className="w-full bg-neutral-950 text-white rounded-full py-1.5 px-3 flex items-center justify-between text-xs cursor-pointer shadow-xs active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {renderCategoryBadge(activeItem.category)}
            <span className="font-bold text-[11px] truncate text-white">
              {activeItem.title}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-neutral-400 text-[10px]">
            <span>{currentIndex + 1}/{noticeItems.length}</span>
            <ArrowUpRight className="w-3 h-3 text-[#d4f940]" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COMPANY ANNOUNCEMENTS & NOTICES MODAL                          */}
      {/* ============================================================== */}
      {showAnnouncementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-2xl border border-neutral-200 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[88vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-neutral-950 text-[#d4f940] flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-950 leading-tight">
                    Company Announcements & Important Notices
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Live broadcasts, critical warnings, and workspace notifications
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 text-white hover:bg-[#d4f940] hover:text-neutral-950 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showCreateForm ? 'Cancel' : 'Broadcast'}</span>
                  </button>
                )}
                <button
                  onClick={() => setShowAnnouncementsModal(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Admin Broadcast New Announcement Form */}
            {isAdmin && showCreateForm && (
              <form onSubmit={handleCreateAnnouncement} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                    Post New Company Announcement
                  </span>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="px-2.5 py-1 rounded-full border border-neutral-200 bg-white text-xs font-bold text-neutral-800"
                  >
                    <option value="announcement">Notice / Announcement</option>
                    <option value="alert">Critical Alert</option>
                    <option value="milestone">Milestone Achievement</option>
                    <option value="update">System Update</option>
                  </select>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Announcement headline (e.g., All-Hands Sync at 3:00 PM)..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none font-bold"
                />

                <textarea
                  rows={2}
                  placeholder="Detailed announcement content or instructions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none resize-none font-medium text-neutral-700"
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                  <input
                    type="text"
                    placeholder="Optional target link (e.g. /projects or /meetings)"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none"
                  />
                  <PillButton type="submit" variant="lime" size="sm">
                    Publish to Top Pill
                  </PillButton>
                </div>
              </form>
            )}

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
              {(
                [
                  { id: 'all', label: `All Notices (${noticeItems.length})` },
                  {
                    id: 'announcements',
                    label: `Announcements (${noticeItems.filter((i) => i.category === 'announcement' || i.category === 'milestone').length})`,
                  },
                  {
                    id: 'alerts',
                    label: `Urgent Alerts (${noticeItems.filter((i) => i.category === 'warning' || i.category === 'alert').length})`,
                  },
                  {
                    id: 'notifications',
                    label: `Notifications (${noticeItems.filter((i) => i.category === 'notification').length})`,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalFilter(tab.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    modalFilter === tab.id
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notice Items Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {noticeItems
                .filter((item) => {
                  if (modalFilter === 'announcements') return item.category === 'announcement' || item.category === 'milestone';
                  if (modalFilter === 'alerts') return item.category === 'warning' || item.category === 'alert';
                  if (modalFilter === 'notifications') return item.category === 'notification';
                  return true;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-neutral-100 hover:border-neutral-900 bg-[#fafbfa] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/card"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {renderCategoryBadge(item.category)}
                        <h4 className="text-xs font-black text-neutral-950 leading-tight">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">{item.content}</p>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-semibold pt-0.5">
                        {item.author && <span>By {item.author}</span>}
                        {item.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.time).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action button */}
                    {item.link && (
                      <button
                        onClick={() => {
                          setShowAnnouncementsModal(false);
                          router.push(item.link!);
                        }}
                        className="px-3 py-1.5 rounded-full bg-neutral-950 hover:bg-[#d4f940] text-white hover:text-neutral-950 text-xs font-bold transition-all flex items-center gap-1 shrink-0 self-start sm:self-center cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span>Auto-rotates in top header pill every 5.5 seconds</span>
              <button
                onClick={() => setShowAnnouncementsModal(false)}
                className="font-bold text-neutral-700 hover:text-neutral-950"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
