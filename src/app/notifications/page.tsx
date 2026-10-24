'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  const userNotifications = notifications.filter(
    (n) => n.user_id === user?.id || !n.user_id
  );

  return (
    <WorkspaceShell
      title="Notifications & Alerts"
      description="Stay informed on task assignments, Tuesday review reminders, and executive feedback"
    >
      <div className="bg-white rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Activity Inbox</h3>
            <p className="text-xs text-neutral-400">
              Showing recent alerts directed to {user?.full_name}
            </p>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {userNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                notif.is_read
                  ? 'bg-neutral-50/50 border-neutral-200/60 opacity-80'
                  : 'bg-white border-neutral-900 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl mt-0.5 ${
                    notif.type === 'report_feedback'
                      ? 'bg-teal-50 text-teal-700'
                      : notif.type === 'meeting_reminder'
                      ? 'bg-blue-50 text-blue-700'
                      : notif.type === 'task_overdue'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900">{notif.title}</span>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    {new Date(notif.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {notif.link && (
                <Link
                  href={notif.link}
                  className="shrink-0 text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 pt-1"
                >
                  View <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}

          {userNotifications.length === 0 && (
            <div className="text-center py-12 text-neutral-400 text-xs font-medium">
              No notifications yet. You are completely up to date!
            </div>
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
