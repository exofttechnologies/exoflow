'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Kanban,
  List,
  MoreVertical,
  Calendar,
  User,
  Shield,
  X,
  ArrowUpRight,
  ShieldAlert,
  FileCheck,
  CheckSquare,
  Square,
  ExternalLink,
  ChevronRight,
  Percent,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { TaskStatus, PriorityLevel, Task } from '@/types/database';
import { PillButton, CircleButton, SelectPill, DateBadgePill } from '@/components/ui/button';

export default function TasksPage() {
  const { user, isAdmin } = useAuth();
  const {
    tasks,
    projects,
    profiles,
    createTask,
    updateTaskStatus,
    deleteTask,
    addWarningAlert,
    clearWarningAlert,
    submitTaskProof,
    toggleTaskComplete,
  } = useData();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<Task | null>(null);

  // Filter only employees for task assignment (Admin has no task)
  const employeeProfiles = profiles.filter((p) => p.role === 'employee');

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || '');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(employeeProfiles[0]?.id || '');

  // Blocker report form state
  const [blockerText, setBlockerText] = useState('');
  const [reportingBlockerForId, setReportingBlockerForId] = useState<string | null>(null);

  // Admin Warning Alert Modal State
  const [warningModalTaskId, setWarningModalTaskId] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState('');

  // Proof Modal State
  const [proofModalTaskId, setProofModalTaskId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [proofNote, setProofNote] = useState('');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === 'all' || t.project_id === selectedProject;
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;

    let matchesStatus = true;
    if (statusFilter === 'Urgent') matchesStatus = t.priority === 'urgent' || t.priority === 'high';
    else if (statusFilter === 'In Progress') matchesStatus = t.status === 'in_progress';
    else if (statusFilter === 'In Review') matchesStatus = t.status === 'in_review';
    else if (statusFilter === 'Blocked') matchesStatus = t.status === 'blocked';
    else if (statusFilter === 'Completed') matchesStatus = t.status === 'completed';

    return matchesSearch && matchesProject && matchesPriority && matchesStatus;
  });

  const columns: { status: TaskStatus; label: string; color: string; badge: string }[] = [
    { status: 'todo', label: 'To Do', color: 'border-slate-300', badge: 'bg-neutral-100 text-neutral-700' },
    { status: 'in_progress', label: 'In Progress', color: 'border-teal-500', badge: 'bg-[#d4f940] text-neutral-950 font-bold' },
    { status: 'blocked', label: 'Blocked', color: 'border-red-500', badge: 'bg-red-500 text-white font-bold' },
    { status: 'in_review', label: 'In Review', color: 'border-amber-500', badge: 'bg-amber-100 text-amber-900 font-bold' },
    { status: 'completed', label: 'Completed', color: 'border-emerald-500', badge: 'bg-neutral-900 text-white font-bold' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    // Guarantee that assignee is an employee
    const targetAssignee = employeeProfiles.find((p) => p.id === newAssigneeId) || employeeProfiles[0];

    createTask({
      title: newTitle,
      description: newDescription,
      project_id: newProjectId || projects[0].id,
      priority: newPriority,
      due_date: newDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignee_ids: [targetAssignee.id],
      assignees: [targetAssignee],
      status: 'todo',
      progress: 0,
    });

    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);
  };

  const handleBlockerSubmit = (taskId: string) => {
    if (!blockerText) return;
    updateTaskStatus(taskId, 'blocked', undefined, blockerText);
    setBlockerText('');
    setReportingBlockerForId(null);
  };

  const handleSaveWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningModalTaskId || !warningMessage) return;
    addWarningAlert(warningModalTaskId, warningMessage);
    setWarningModalTaskId(null);
    setWarningMessage('');
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofModalTaskId || !proofUrl) return;
    submitTaskProof(proofModalTaskId, proofUrl, proofNote);
    setProofModalTaskId(null);
    setProofUrl('');
    setProofNote('');
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const blockedCount = tasks.filter((t) => t.status === 'blocked').length;

  return (
    <WorkspaceShell
      title="Company Tasks"
      description="Manage assignments, set priorities, track velocity, and report blockers"
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER (MATCHING REFERENCE WORKSPACE DETAILS)         */}
      {/* ============================================================== */}
      <PageTopHeader
        title="TASKS"
        actionButton={
          isAdmin && (
            <PillButton
              variant="black"
              size="md"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowCreateModal(true)}
            >
              Add Task
            </PillButton>
          )
        }
        metrics={[
          { value: tasks.length, label: 'Tasks', trend: '↑ 4 Sprint', trendType: 'lime' },
          { value: completedCount, label: 'Done', trend: '↑ 3', trendType: 'orange' },
          { value: blockedCount, label: 'Blocked', trend: '↓ 1', trendType: 'negative' },
        ]}
        categoryLabel="Sprint Deliverables"
        categoryCount={`${filteredTasks.length} Tasks`}
        filters={['All', 'Urgent', 'In Progress', 'In Review', 'Blocked', 'Completed']}
        activeFilter={statusFilter}
        onFilterChange={(f) => setStatusFilter(f)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search task title or description..."
      />

      {/* Filter Row: Project & Priority Selectors + Kanban/List Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-xs text-neutral-800 font-bold focus:outline-none shadow-2xs"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-xs text-neutral-800 font-bold focus:outline-none shadow-2xs"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* View Mode & Add Task Pill Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-neutral-200 rounded-full p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'kanban' ? 'bg-neutral-950 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'list' ? 'bg-neutral-950 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="List View with Checkbox"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Checklist</span>
            </button>
          </div>

          {isAdmin && (
            <PillButton
              variant="black"
              size="md"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowCreateModal(true)}
            >
              Add Task
            </PillButton>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* KANBAN BOARD VIEW (CARDS DISPLAYING ASSIGNEE, PROGRESS, WARN)  */}
      {/* ============================================================== */}
      {viewMode === 'kanban' ? (
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 items-start overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory -mx-3.5 px-3.5 sm:mx-0 sm:px-0 touch-scroll">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div key={col.status} className="bg-neutral-100/70 p-3.5 rounded-[24px] sm:rounded-[28px] w-[82vw] sm:w-[300px] md:w-auto shrink-0 md:shrink snap-center">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-200/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-neutral-950">{col.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge} shadow-xs`}>
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-3">
                  {columnTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.project_id);
                    const assignees = profiles.filter((p) => task.assignee_ids?.includes(p.id));
                    const assignedEmployee = assignees[0];

                    return (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs hover:border-neutral-900 transition-all select-none space-y-2.5"
                      >
                        {/* Project & Priority */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400 font-semibold truncate max-w-[130px]">
                            {project?.name || 'Project'}
                          </span>
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
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-black text-neutral-900 line-clamp-2 leading-snug">
                          {task.title}
                        </h4>

                        {/* Person Who Is Assigned (Avatar + Name + Role) */}
                        {assignedEmployee ? (
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                            <img
                              src={assignedEmployee.avatar_url}
                              alt={assignedEmployee.full_name}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-white shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-extrabold text-neutral-900 truncate leading-none">
                                {assignedEmployee.full_name}
                              </p>
                              <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                                {assignedEmployee.designation}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-400 italic">No employee assigned</div>
                        )}

                        {/* Task Progress Bar & Percentage */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-neutral-600 mb-1">
                            <span>Progress</span>
                            <span className="font-extrabold text-neutral-900">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#d4f940] h-full rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Admin Warning Alert Banner */}
                        {task.warning_alert && (
                          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-400 text-[10px] text-amber-950 font-bold space-y-1">
                            <div className="flex items-center gap-1 text-amber-800">
                              <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Admin Warning:</span>
                            </div>
                            <p className="leading-tight">{task.warning_alert}</p>
                          </div>
                        )}

                        {/* Proof of Work Banner */}
                        {task.proof_url && (
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900 flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1 truncate">
                              <FileCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="font-bold">Proof Attached</span>
                            </div>
                            <a
                              href={task.proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 font-extrabold underline inline-flex items-center gap-0.5 shrink-0"
                            >
                              Inspect <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        )}

                        {/* Bottom Row: Due Date & Actions */}
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400 flex items-center gap-1 font-semibold text-[10px]">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {task.due_date}
                          </span>

                          <div className="flex items-center gap-1">
                            {/* Admin Warning Button */}
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  setWarningModalTaskId(task.id);
                                  setWarningMessage(task.warning_alert || '');
                                }}
                                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-neutral-200 hover:border-amber-400 bg-white text-neutral-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer shadow-2xs"
                                title="Add/Edit Warning Alert"
                              >
                                <ShieldAlert className="w-2.5 h-2.5 text-amber-600" />
                                <span>{task.warning_alert ? 'Edit' : 'Warn'}</span>
                              </button>
                            )}

                            {/* Add Proof Button */}
                            <button
                              onClick={() => {
                                setProofModalTaskId(task.id);
                                setProofUrl(task.proof_url || '');
                                setProofNote(task.proof_note || '');
                              }}
                              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-neutral-200 hover:border-neutral-900 bg-white text-neutral-800 flex items-center gap-0.5 cursor-pointer shadow-2xs"
                              title="Attach Proof of Work"
                            >
                              <FileCheck className="w-2.5 h-2.5 text-neutral-600" />
                              <span>{task.proof_url ? 'Proof' : '+Proof'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Quick Status Select */}
                        <div className="pt-1 flex items-center justify-between">
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="text-[10px] bg-neutral-50 border border-neutral-200 rounded-full px-2.5 py-0.5 font-bold text-neutral-800 focus:outline-none w-full cursor-pointer"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="blocked">Blocked</option>
                            <option value="in_review">In Review</option>
                            <option value="completed">Completed ✓</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-neutral-400 text-xs font-medium border border-dashed border-neutral-200 rounded-2xl">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================================= */
        /* LIST VIEW WITH INTERACTIVE CHECKBOXES & ADDING PROOF                      */
        /* (MATCHING USER REQUIREMENT: VIEW EACH TASK AS LIST WITH CHECKBOX + PROOF) */
        /* ========================================================================= */
        <div className="bg-white rounded-[28px] border border-neutral-200/80 shadow-2xs overflow-hidden select-none">
          <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 text-xs font-bold text-neutral-600 flex items-center justify-between">
            <span>Interactive Task Checklist ({filteredTasks.length} Deliverables)</span>
            <span className="text-[11px] text-neutral-500 font-semibold">
              Click checkboxes to toggle completion • Attach proof for verification
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredTasks.map((task) => {
              const project = projects.find((p) => p.id === task.project_id);
              const assignees = profiles.filter((p) => task.assignee_ids?.includes(p.id));
              const assignedEmployee = assignees[0];
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'bg-neutral-50/60'
                      : task.warning_alert
                      ? 'bg-amber-50/40 hover:bg-amber-50/60'
                      : 'hover:bg-neutral-50/80'
                  }`}
                >
                  {/* Left: Checkbox + Task Information */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
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

                        <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
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

                      {/* Warning Alert Banner */}
                      {task.warning_alert && (
                        <div className="mt-2 p-2 rounded-xl bg-amber-500/15 border border-amber-300 text-xs text-amber-900 font-bold flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Warning Alert: {task.warning_alert}</span>
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => clearWarningAlert(task.id)}
                              className="text-[10px] text-amber-700 hover:text-amber-950 underline font-bold cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )}

                      {/* Proof of Work Information */}
                      {task.proof_url && (
                        <div className="mt-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Proof Attached: </span>
                            <a
                              href={task.proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline text-emerald-700 inline-flex items-center gap-1"
                            >
                              {task.proof_url} <ExternalLink className="w-3 h-3" />
                            </a>
                            {task.proof_note && (
                              <span className="text-neutral-500 italic">({task.proof_note})</span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Assigned Person & Action Buttons */}
                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                    {/* Assigned Person */}
                    {assignedEmployee && (
                      <div className="flex items-center gap-2 text-right">
                        <div className="hidden md:block">
                          <p className="text-xs font-bold text-neutral-900 leading-none">
                            {assignedEmployee.full_name}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            {assignedEmployee.designation}
                          </p>
                        </div>
                        <img
                          src={assignedEmployee.avatar_url}
                          alt={assignedEmployee.full_name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-2xs"
                          title={`${assignedEmployee.full_name} (${assignedEmployee.designation})`}
                        />
                      </div>
                    )}

                    {/* Progress Indicator */}
                    <div className="w-16 hidden lg:block text-right">
                      <span className="text-xs font-black text-neutral-900">{task.progress}%</span>
                      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-[#d4f940] h-full rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Admin Warning Alert */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setWarningModalTaskId(task.id);
                            setWarningMessage(task.warning_alert || '');
                          }}
                          className="text-xs font-extrabold px-3 py-1.5 rounded-full border border-neutral-200 hover:border-amber-400 bg-white text-neutral-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                        >
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>{task.warning_alert ? 'Edit Alert' : 'Add Alert'}</span>
                        </button>
                      )}

                      {/* Add Proof Button */}
                      <button
                        onClick={() => {
                          setProofModalTaskId(task.id);
                          setProofUrl(task.proof_url || '');
                          setProofNote(task.proof_note || '');
                        }}
                        className="text-xs font-extrabold px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-900 bg-white text-neutral-800 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-neutral-600" />
                        <span>{task.proof_url ? 'View Proof' : 'Add Proof'}</span>
                      </button>

                      {/* Status Dropdown */}
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-all ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-white text-neutral-800 border-neutral-200'
                        }`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="blocked">Blocked</option>
                        <option value="in_review">In Review</option>
                        <option value="completed">Completed</option>
                      </select>

                      {/* Delete Task (Admin Only) */}
                      {isAdmin && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Delete Task"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE TASK (ADMIN ONLY ASSIGNS TO EMPLOYEES)           */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 z-50 animate-in fade-in select-none">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-neutral-200 max-h-[88vh] overflow-y-auto touch-scroll">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-black text-neutral-950">Add New Deliverable</h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-4 h-4" />
              </CircleButton>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement Payment Webhooks"
                  required
                  className="w-full p-3 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Task scope, acceptance criteria, and technical links..."
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Project Pipeline
                  </label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-bold shadow-2xs"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-bold shadow-2xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Assign To Employee (Staff Only)
                  </label>
                  <select
                    value={newAssigneeId}
                    onChange={(e) => setNewAssigneeId(e.target.value)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-bold shadow-2xs"
                  >
                    {employeeProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name} ({p.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-semibold shadow-2xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="submit"
                  variant="black"
                  size="md"
                >
                  Assign Deliverable
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADMIN WARNING ALERT                                     */}
      {/* ============================================================== */}
      {warningModalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-black text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Issue Warning Alert to Employee
              </h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setWarningModalTaskId(null)}
              >
                <X className="w-3.5 h-3.5" />
              </CircleButton>
            </div>

            <form onSubmit={handleSaveWarning} className="space-y-4">
              <p className="text-xs text-neutral-600">
                Add an operational warning for the assigned employee. This alert will be highlighted on their task and recorded in sprint oversight.
              </p>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Warning Alert Message *
                </label>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="e.g. Overdue by 2 days. Blocker needs immediate escalation or proof submitted today."
                  required
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-amber-300 bg-amber-50/40 text-xs focus:outline-none focus:border-amber-600 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setWarningModalTaskId(null)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="submit"
                  variant="black"
                  size="md"
                >
                  Post Warning Alert
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / VIEW PROOF OF WORK                                */}
      {/* ============================================================== */}
      {proofModalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-black text-neutral-950 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Proof of Work Submission
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
              <p className="text-xs text-neutral-600">
                Attach proof of work (GitHub PR link, Figma design link, Staging demo URL, or Loom video) to mark task complete with audit verification.
              </p>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Proof URL (PR link, Figma, Demo URL) *
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/exoft/pull/104 or https://figma.com/..."
                  required
                  className="w-full p-2.5 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Verification Note (Optional)
                </label>
                <textarea
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="e.g. Unit tests pass (32/32), QA verified in staging, ready for production merge."
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
                  Submit Proof & Complete
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
