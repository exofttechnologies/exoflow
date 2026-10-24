'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  Users,
  ArrowRight,
  TrendingUp,
  Plus,
  CheckSquare,
  AlertCircle,
  ExternalLink,
  Bell,
  Info,
  Send,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import {
  PillButton,
  CircleButton,
  SelectPill,
  DateBadgePill,
  DayPill,
} from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { projects, tasks, meetings, reports, activityLogs, profiles, updateTaskStatus } = useData();

  const [now, setNow] = useState('2026-10-17');
  const [selectedDay, setSelectedDay] = useState(20); // Tuesday 20th
  const [selectedReportFilter, setSelectedReportFilter] = useState('All Reports');
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [selectedLeadFilter, setSelectedLeadFilter] = useState('All');
  const [searchLeadQuery, setSearchLeadQuery] = useState('');

  useEffect(() => {
    setNow(new Date().toISOString().split('T')[0]);
  }, []);

  // Common calculations
  const activeProjects = projects.filter((p) => p.status === 'active');
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.due_date < now
  );
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const blockedTasks = tasks.filter((t) => t.status === 'blocked');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  // Employee-specific
  const myAssignedTasks = tasks.filter((t) =>
    t.assignee_ids?.includes(user?.id || '')
  );
  const myCompletedTasks = myAssignedTasks.filter((t) => t.status === 'completed');
  const myOverdueTasks = myAssignedTasks.filter(
    (t) => t.status !== 'completed' && t.due_date < now
  );
  const myProgressRate =
    myAssignedTasks.length > 0
      ? Math.round((myCompletedTasks.length / myAssignedTasks.length) * 100)
      : 100;

  // Chart data
  const taskStatusData = [
    { name: 'To Do', count: tasks.filter((t) => t.status === 'todo').length, color: '#94a3b8' },
    { name: 'In Progress', count: inProgressTasks.length, color: '#0d9488' },
    { name: 'Blocked', count: blockedTasks.length, color: '#ef4444' },
    { name: 'In Review', count: tasks.filter((t) => t.status === 'in_review').length, color: '#f59e0b' },
    { name: 'Completed', count: completedTasks.length, color: '#10b981' },
  ];

  const efficiencyData = [
    { day: 'Mon', val: 20 },
    { day: 'Tue', val: 38 },
    { day: 'Wed', val: 28 },
    { day: 'Thu', val: 55 },
    { day: 'Fri', val: 48 },
    { day: 'Sat', val: 62 },
  ];

  const featuredProject = projects[0] || {
    name: 'Exoft Flow',
    description: 'Internal Company Workspace',
    progress: 85,
    client_name: 'SaaS Platform',
  };

  return (
    <WorkspaceShell
      title={isAdmin ? 'Executive Dashboard' : 'My Workspace'}
      description={
        isAdmin
          ? 'Company performance, active deliverables, and operational oversight'
          : `Welcome back, ${user?.full_name}. Here is your task agenda and weekly focus.`
      }
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER (EXACT MATCH TO REFERENCE "WORKSPACE" DETAILS) */}
      {/* ============================================================== */}
      <PageTopHeader
        title="WORKSPACE"
        actionButton={
          <Link href="/tasks">
            <PillButton
              variant="black"
              size="md"
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Task
            </PillButton>
          </Link>
        }
        metrics={[
          { value: activeProjects.length, label: 'Projects', trend: `↑ ${projects.length} Total`, trendType: 'lime' },
          { value: completedTasks.length, label: 'Delivered', trend: '↑ 4 Sprint', trendType: 'orange' },
          { value: blockedTasks.length, label: 'Blockers', trend: blockedTasks.length > 0 ? '↓ 1 active' : '0 issues', trendType: 'negative' },
        ]}
        categoryLabel="Sprint Deliverables"
        categoryCount={`${tasks.length} Deliverables`}
        filters={['All', 'Urgent', 'In Progress', 'In Review', 'Blocked', 'Completed']}
        activeFilter={selectedLeadFilter}
        onFilterChange={(f) => setSelectedLeadFilter(f)}
        searchValue={searchLeadQuery}
        onSearchChange={setSearchLeadQuery}
        searchPlaceholder="Search projects, sprint deliverables, tasks..."
      />


      {/* ============================================================== */}
      {/* HERO SPOTLIGHT & UPCOMING MEETINGS (INSPIRED BY REFERENCE UI)  */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Lime Feature Card (7 Cols) */}
        <div className="lg:col-span-7 bg-[#d4f940] rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all">
          <div>
            {/* Top Row: PM Avatar + Floating Circle Buttons */}
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user?.full_name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-neutral-900/10 shadow-xs"
                />
                <div>
                  <h3 className="text-sm font-bold text-neutral-950 leading-tight">
                    {user?.full_name || 'Alex Vance'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-800/80 font-medium">{user?.designation || 'Project Manager'}</p>
                </div>
              </div>

              {/* Top-Right Circular White Pill Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CircleButton variant="white" size="sm" className="sm:w-10 sm:h-10" title="Notifications">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900" />
                </CircleButton>
                <CircleButton variant="white" size="sm" className="sm:w-10 sm:h-10" title="Project Details">
                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900" />
                </CircleButton>
              </div>
            </div>

            {/* Project Title & Industry */}
            <div className="mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                {featuredProject.name}
              </h2>
              <p className="text-xs font-semibold text-neutral-800/80 mt-1.5 sm:mt-2">
                Industry: <span className="font-bold text-neutral-950">Enterprise SaaS</span>
              </p>
            </div>

            {/* Pill Progress Bar (Matching Reference) */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-950 mb-2">
                <span>Project progress</span>
                <span className="text-sm font-extrabold">{featuredProject.progress}%</span>
              </div>
              <div className="w-full bg-neutral-950/15 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-neutral-950 h-full rounded-full transition-all duration-500"
                  style={{ width: `${featuredProject.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Controls Row: Select Pill + Circle Send Button */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="relative">
              <SelectPill
                label={selectedReportFilter}
                icon={<FileText className="w-4 h-4 text-neutral-800" />}
                onClick={() => setShowReportDropdown(!showReportDropdown)}
                className="bg-white/90 border-neutral-900/10 hover:bg-white text-neutral-950"
              />
              {showReportDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-30 animate-in fade-in">
                  {['All Reports', 'Weekly Friday Report', 'Sprint Velocity', 'Task Audit'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSelectedReportFilter(opt);
                        setShowReportDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-neutral-100 text-neutral-800"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/reports">
              <CircleButton variant="black" size="lg" title="Open Reports">
                <Send className="w-5 h-5 text-white" />
              </CircleButton>
            </Link>
          </div>
        </div>

        {/* Right Upcoming Meetings Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header: Title + Month Selector Pill */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                  Upcoming
                  <br />
                  Meetings
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100/90 text-xs font-bold text-neutral-800 hover:bg-neutral-200/80 transition-all cursor-pointer">
                <span>October</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5 mb-5 sm:mb-6">
              <span>📞 3 calls</span>
              <span>•</span>
              <span className="text-neutral-700 font-bold">Tue, 20</span>
            </p>

            {/* Calendar Day Pills Row (Exact match to reference UI) */}
            <div className="flex items-center justify-between gap-1.5 mb-6 sm:mb-8 overflow-x-auto scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0 py-1 touch-scroll">
              {[
                { day: 17, name: 'Sat' },
                { day: 18, name: 'Sun' },
                { day: 19, name: 'Mon' },
                { day: 20, name: 'Tue' },
                { day: 21, name: 'Wed' },
                { day: 22, name: 'Thu' },
              ].map((item) => (
                <DayPill
                  key={item.day}
                  dayNumber={item.day}
                  dayName={item.name}
                  isActive={selectedDay === item.day}
                  onClick={() => setSelectedDay(item.day)}
                  className="shrink-0"
                />
              ))}
            </div>

            {/* Progress dot timeline track */}
            <div className="relative flex items-center justify-between px-3 mb-5 sm:mb-6">
              <div className="absolute inset-x-3 h-0.5 bg-neutral-100 -z-1" />
              {[17, 18, 19, 20, 21, 22].map((d) => (
                <div
                  key={d}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    d === selectedDay
                      ? 'bg-neutral-950 ring-4 ring-neutral-200'
                      : 'bg-neutral-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Meeting Details Pill Link */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#d4f940] text-neutral-950 shrink-0">
                  Tuesday Sync
                </span>
                <span className="text-xs font-bold text-neutral-900 truncate">
                  Weekly Progress Review
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5 truncate">10:00 AM UTC • 7 participants</p>
            </div>

            <Link href="/meetings" className="shrink-0">
              <CircleButton variant="white" size="sm">
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-800" />
              </CircleButton>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECOND ROW: PROJECT ROADMAP & METRICS (STYLE MATCH)            */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Project Roadmap Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header: Title + "+ Add task" Pill Button */}
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                  Project
                  <br />
                  Roadmap
                </h3>
              </div>

              <Link href="/tasks">
                <PillButton variant="black" size="sm" className="sm:text-xs" icon={<Plus className="w-3.5 h-3.5" />}>
                  Add task
                </PillButton>
              </Link>
            </div>

            {/* Visual Roadmap Pill Timeline */}
            <div className="space-y-3 mb-5 sm:mb-6">
              {/* Intro Pill */}
              <div className="flex items-center gap-3">
                <div className="w-full sm:w-1/2 p-2.5 rounded-full bg-neutral-600 text-white flex items-center justify-between text-xs font-bold px-3.5 sm:px-4 shadow-xs">
                  <span className="truncate pr-2">Intro</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold opacity-90">100%</span>
                    <div className="flex -space-x-1">
                      <img
                        src={profiles[0]?.avatar_url}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                      />
                      <img
                        src={profiles[1]?.avatar_url}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Pill */}
              <div className="flex items-center sm:justify-center">
                <div className="w-full sm:w-3/5 p-2.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 flex items-center justify-between text-xs font-bold px-3.5 sm:px-4 shadow-xs">
                  <span className="truncate pr-2">Audit & Architecture</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-neutral-600">59%</span>
                    <img
                      src={profiles[4]?.avatar_url}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                    />
                  </div>
                </div>
              </div>

              {/* Research Pill (Lime Accent!) */}
              <div className="flex items-center gap-3">
                <div className="w-full sm:w-3/4 p-2.5 rounded-full bg-[#d4f940] text-neutral-950 flex items-center justify-between text-xs font-bold px-3.5 sm:px-4 shadow-xs">
                  <span className="truncate pr-2">Frontend Implementation</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold">75%</span>
                    <div className="flex -space-x-1">
                      <img
                        src={profiles[2]?.avatar_url}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-neutral-900"
                      />
                      <img
                        src={profiles[3]?.avatar_url}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-neutral-900"
                      />
                      <img
                        src={profiles[5]?.avatar_url}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Days Footer */}
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 pt-3 border-t border-neutral-100 overflow-x-auto scrollbar-none py-1">
            <span>Mon 12</span>
            <span>Tue 13</span>
            <span>Wed 14</span>
            <span className="text-neutral-950 font-bold">Thu 15</span>
            <span>Fri 16</span>
          </div>
        </div>

        {/* Efficiency, Hours & Assistant Widgets (5 Cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Efficiency Card (Black with Neon Wave) */}
          <div className="bg-neutral-950 rounded-[28px] sm:rounded-[32px] p-5 text-white flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-neutral-300">Efficiency</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d4f940] text-neutral-950">
                  +40%
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-medium">October sprint velocity</p>
            </div>

            {/* Sparkline Neon Wave */}
            <div className="h-20 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={efficiencyData}>
                  <Line
                    type="monotone"
                    dataKey="val"
                    stroke="#d4f940"
                    strokeWidth={3}
                    dot={{ fill: '#d4f940', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] text-neutral-400 font-medium text-center">
              Steady +15% weekly throughput
            </div>
          </div>

          {/* Total Project Time Card */}
          <div className="bg-[#8b988c] rounded-[28px] sm:rounded-[32px] p-5 text-white flex flex-col justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-white/20">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-white/90">Total project time</span>
            </div>

            <div className="my-3">
              <div className="text-3xl font-extrabold text-white tracking-tight">645 h</div>
              <p className="text-[11px] text-white/80 font-medium mt-1">Logged across 15 tasks</p>
            </div>

            <Link href="/analytics" className="text-xs font-bold text-white hover:underline flex items-center gap-1">
              <span>View Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Project Creation Launcher Widget */}
          <div className="col-span-1 sm:col-span-2 bg-neutral-900 text-white rounded-[24px] sm:rounded-[28px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d4f940] flex items-center justify-center text-neutral-950 font-bold shrink-0">
                <FolderKanban className="w-5 h-5 text-neutral-950" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  Start New Project
                </h4>
                <p className="text-[10px] text-neutral-400">
                  Define project scope, features list, and delivery estimates
                </p>
              </div>
            </div>

            <Link href="/projects/new" className="w-full sm:w-auto">
              <PillButton variant="lime" size="sm" className="w-full sm:w-auto" icon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                New Project
              </PillButton>
            </Link>
          </div>
        </div>
      </div>


      {/* ============================================================== */}
      {/* KPI METRIC CARDS & PRIORITY TASKS TABLE                        */}
      {/* ============================================================== */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 border border-neutral-200/80 shadow-xs space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-lg font-extrabold text-neutral-950 tracking-tight">
              Tasks Requiring Immediate Attention
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Review blocked deliverables and upcoming milestones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/tasks">
              <PillButton variant="white" size="sm" icon={<Plus className="w-3 h-3" />}>
                All Tasks ({tasks.length})
              </PillButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks
            .filter((t) => {
              if (searchLeadQuery) {
                const q = searchLeadQuery.toLowerCase();
                if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
              }
              if (selectedLeadFilter === 'Urgent') return t.priority === 'urgent' || t.priority === 'high';
              if (selectedLeadFilter === 'In Progress') return t.status === 'in_progress';
              if (selectedLeadFilter === 'In Review') return t.status === 'in_review';
              if (selectedLeadFilter === 'Blocked') return t.status === 'blocked';
              if (selectedLeadFilter === 'Completed') return t.status === 'completed';
              return t.status === 'blocked' || t.status === 'in_progress' || (t.status !== 'completed' && t.due_date < now);
            })
            .slice(0, 6)
            .map((task) => {

            const project = projects.find((p) => p.id === task.project_id);
            const assignees = profiles.filter((p) => task.assignee_ids?.includes(p.id));

            return (
              <div
                key={task.id}
                className="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-neutral-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-neutral-400 truncate max-w-[140px]">
                      {project?.name || 'Project'}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        task.status === 'blocked'
                          ? 'bg-red-500 text-white'
                          : task.status === 'in_progress'
                          ? 'bg-[#d4f940] text-neutral-950'
                          : 'bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-neutral-950 line-clamp-1">{task.title}</h4>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-200/60 text-xs">
                  <span className="text-[11px] text-neutral-400 font-medium">Due {task.due_date}</span>
                  <div className="flex -space-x-1">
                    {assignees.map((a) => (
                      <img
                        key={a.id}
                        src={a.avatar_url}
                        alt=""
                        title={a.full_name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WorkspaceShell>
  );
}
