'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Square,
  Clock,
  AlertTriangle,
  FileCheck,
  ExternalLink,
  ShieldAlert,
  Plus,
  Search,
  CheckCircle2,
  FolderKanban,
  Shield,
  User,
  ArrowRight,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { TaskStatus, Task } from '@/types/database';
import { PillButton, CircleButton } from '@/components/ui/button';

export default function MyTasksPage() {
  const router = useRouter();
  const { user, isAdmin, switchProfile, allProfiles } = useAuth();
  const {
    tasks,
    projects,
    updateTaskStatus,
    toggleTaskComplete,
    submitTaskProof,
    clearWarningAlert,
  } = useData();

  // Admin has no tasks - automatically redirect admin to All Tasks
  React.useEffect(() => {
    if (isAdmin) {
      router.replace('/tasks');
    }
  }, [isAdmin, router]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('All');

  // Proof Modal State
  const [proofModalTaskId, setProofModalTaskId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [proofNote, setProofNote] = useState('');

  // Blocker Modal State
  const [blockerModalTaskId, setBlockerModalTaskId] = useState<string | null>(null);
  const [blockerText, setBlockerText] = useState('');

  // Tasks assigned to current user
  const myTasks = tasks.filter((t) => t.assignee_ids?.includes(user?.id || ''));

  const filteredMyTasks = myTasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (filterState === 'Pending') matchesFilter = t.status !== 'completed';
    else if (filterState === 'Completed') matchesFilter = t.status === 'completed';
    else if (filterState === 'Has Proof') matchesFilter = Boolean(t.proof_url);
    else if (filterState === '⚠️ Warnings') matchesFilter = Boolean(t.warning_alert);

    return matchesSearch && matchesFilter;
  });

  const completedCount = myTasks.filter((t) => t.status === 'completed').length;
  const warningCount = myTasks.filter((t) => t.warning_alert).length;
  const proofCount = myTasks.filter((t) => t.proof_url).length;

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofModalTaskId || !proofUrl) return;
    submitTaskProof(proofModalTaskId, proofUrl, proofNote);
    setProofModalTaskId(null);
    setProofUrl('');
    setProofNote('');
  };

  const handleReportBlocker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockerModalTaskId || !blockerText) return;
    updateTaskStatus(blockerModalTaskId, 'blocked', undefined, blockerText);
    setBlockerModalTaskId(null);
    setBlockerText('');
  };

  // If logged in as Admin, explain that Admin has no tasks and only assigns tasks to employees
  if (isAdmin) {
    return (
      <WorkspaceShell
        title="My Tasks — Administrative View"
        description="Company administrators oversee and assign deliverables to employees"
      >
        <PageTopHeader
          title="MY TASKS"
          metrics={[
            { value: tasks.length, label: 'All Tasks', trend: 'Staff Pipeline', trendType: 'lime' },
            { value: tasks.filter(t => t.status === 'completed').length, label: 'Verified', trend: 'Done', trendType: 'orange' },
            { value: tasks.filter(t => t.warning_alert).length, label: 'Warnings', trend: 'Active Alerts', trendType: 'negative' },
          ]}
          categoryLabel="Admin Assignment Oversight"
          categoryCount="0 Personal Tasks"
          filters={['All', 'Staff Overview']}
          activeFilter="All"
        />

        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-neutral-200/90 shadow-2xs max-w-3xl mx-auto text-center space-y-5 my-6">
          <div className="w-16 h-16 rounded-full bg-neutral-950 text-[#d4f940] flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-neutral-950 tracking-tight">
              Company Administrators Have No Personal Tasks
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
              As an administrator (<strong>{user?.full_name}</strong>), you oversee deliverables, assign tasks exclusively to company employees, inspect progress meters, and issue warning alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Assigned to Staff</span>
              <p className="text-xl font-black text-neutral-900 mt-0.5">{tasks.length}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Staff Completed</span>
              <p className="text-xl font-black text-[#d4f940] text-emerald-800 mt-0.5">
                {tasks.filter((t) => t.status === 'completed').length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Active Warnings</span>
              <p className="text-xl font-black text-amber-600 mt-0.5">{warningCount}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <PillButton
              variant="black"
              size="md"
              icon={<User className="w-3.5 h-3.5" />}
              onClick={() => switchProfile(allProfiles[2].id)}
            >
              Switch to Staff (Liam Patel) to test Checklist
            </PillButton>
            <Link href="/tasks" className="w-full sm:w-auto">
              <PillButton variant="white" size="md">
                View All Deliverables →
              </PillButton>
            </Link>
          </div>
        </div>
      </WorkspaceShell>
    );
  }

  // Employee Checklist View
  return (
    <WorkspaceShell
      title="My Deliverables & Proof Checklist"
      description="Interactive checklist: check off completed items, report blockers, and attach proof of work"
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER                                                */}
      {/* ============================================================== */}
      <PageTopHeader
        title="MY TASKS"
        actionButton={
          <span className="text-xs font-bold text-neutral-600 bg-white border border-neutral-200 px-3 py-1.5 rounded-full shadow-2xs">
            Assigned to {user?.full_name}
          </span>
        }
        metrics={[
          { value: myTasks.length, label: 'Assigned', trend: `${completedCount} Done`, trendType: 'lime' },
          { value: proofCount, label: 'Proof Attached', trend: 'Verified', trendType: 'orange' },
          { value: warningCount, label: 'Warnings', trend: warningCount > 0 ? '⚠️ Action Required' : 'None', trendType: warningCount > 0 ? 'negative' : 'positive' },
        ]}
        categoryLabel="Personal Task Checklist"
        categoryCount={`${filteredMyTasks.length} Deliverables`}
        filters={['All', 'Pending', 'Completed', 'Has Proof', '⚠️ Warnings']}
        activeFilter={filterState}
        onFilterChange={setFilterState}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search your assigned tasks..."
      />

      {/* Checklist Summary Header */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <p className="text-xs font-semibold text-neutral-500">
          Check the box when finished, and attach proof URL (GitHub PR, Figma link, staging URL) to verify completion.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE CHECKLIST VIEW WITH CHECKBOXES & PROOF SUBMISSION             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[28px] border border-neutral-200/80 shadow-2xs overflow-hidden select-none">
        <div className="divide-y divide-neutral-100">
          {filteredMyTasks.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-bold text-neutral-800">No tasks found matching current filter</h3>
              <p className="text-xs text-neutral-400">All caught up or try selecting "All".</p>
            </div>
          ) : (
            filteredMyTasks.map((task) => {
              const project = projects.find((p) => p.id === task.project_id);
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'bg-neutral-50/60'
                      : task.warning_alert
                      ? 'bg-amber-50/50 hover:bg-amber-50/70 border-l-4 border-l-amber-500'
                      : 'hover:bg-neutral-50/80'
                  }`}
                >
                  {/* Left: Checkbox & Information */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Interactive Checkbox */}
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 text-neutral-400 hover:text-neutral-950 transition-colors cursor-pointer shrink-0"
                      title={isCompleted ? 'Mark in progress' : 'Mark completed'}
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400 hover:text-neutral-900" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            task.priority === 'urgent'
                              ? 'bg-red-500 text-white'
                              : task.priority === 'high'
                              ? 'bg-amber-500 text-white'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                          {project?.name || 'Project'}
                        </span>

                        <h4
                          className={`text-sm font-black text-neutral-950 ${
                            isCompleted ? 'line-through text-neutral-400' : ''
                          }`}
                        >
                          {task.title}
                        </h4>

                        <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due {task.due_date}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Admin Warning Alert (Notice highlighted to employee) */}
                      {task.warning_alert && (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-300 text-xs text-amber-950 font-bold space-y-0.5">
                          <div className="flex items-center gap-1.5 text-amber-800">
                            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>⚠️ High Priority Alert from Admin:</span>
                          </div>
                          <p className="text-[11px] text-amber-900 font-semibold pl-5">
                            {task.warning_alert}
                          </p>
                        </div>
                      )}

                      {/* Attached Proof of Work */}
                      {task.proof_url && (
                        <div className="mt-1.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <span className="font-extrabold text-emerald-900">Proof Submitted: </span>
                              <a
                                href={task.proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline text-emerald-700 inline-flex items-center gap-1"
                              >
                                {task.proof_url} <ExternalLink className="w-3 h-3" />
                              </a>
                              {task.proof_note && (
                                <p className="text-[11px] text-emerald-800 mt-0.5">{task.proof_note}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Add Proof Button & Status */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    {/* Add / View Proof Button */}
                    <button
                      onClick={() => {
                        setProofModalTaskId(task.id);
                        setProofUrl(task.proof_url || '');
                        setProofNote(task.proof_note || '');
                      }}
                      className="text-xs font-extrabold px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-900 bg-white text-neutral-800 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-neutral-600" />
                      <span>{task.proof_url ? 'Update Proof' : '+ Add Proof'}</span>
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-all ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : task.status === 'blocked'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-white text-neutral-800 border-neutral-200'
                      }`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="blocked">Blocked</option>
                      <option value="in_review">In Review</option>
                      <option value="completed">Completed ✓</option>
                    </select>

                    {/* Blocker reporting button */}
                    {task.status !== 'blocked' && (
                      <button
                        onClick={() => {
                          setBlockerModalTaskId(task.id);
                          setBlockerText(task.blocker_description || '');
                        }}
                        className="text-[11px] text-red-600 hover:underline font-bold px-1"
                        title="Report a Blocker"
                      >
                        Blocker?
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ATTACH PROOF OF WORK                                    */}
      {/* ============================================================== */}
      {proofModalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-black text-neutral-950 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Submit Proof of Deliverable
              </h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setProofModalTaskId(null)}
              >
                <X className="w-3.5 h-3.5" />
              </CircleButton>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <p className="text-xs text-neutral-600 leading-relaxed">
                Provide a link to your work (GitHub PR link, Figma design link, staging demo URL, or Loom video) to verify task completion with company administrators.
              </p>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Proof URL *
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/exoft/pull/123 or https://figma.com/..."
                  required
                  className="w-full p-2.5 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Verification Summary / Notes (Optional)
                </label>
                <textarea
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="e.g. Unit tests passing (100%), responsive layout verified on mobile, ready for review."
                  rows={2}
                  className="w-full p-2.5 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setProofModalTaskId(null)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="submit"
                  variant="black"
                  size="md"
                >
                  Attach Proof & Complete
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REPORT BLOCKER                                          */}
      {/* ============================================================== */}
      {blockerModalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-black text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Report Task Blocker
              </h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setBlockerModalTaskId(null)}
              >
                <X className="w-3.5 h-3.5" />
              </CircleButton>
            </div>

            <form onSubmit={handleReportBlocker} className="space-y-4">
              <p className="text-xs text-neutral-600 leading-relaxed">
                Describe what is blocking this task so management can address it in the Tuesday review meeting.
              </p>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Blocker Description *
                </label>
                <textarea
                  value={blockerText}
                  onChange={(e) => setBlockerText(e.target.value)}
                  placeholder="e.g. Waiting on third-party webhook credentials or design approval..."
                  required
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-red-300 bg-red-50/30 text-xs focus:outline-none focus:border-red-600 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setBlockerModalTaskId(null)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="submit"
                  variant="black"
                  size="md"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Flag as Blocked
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
