'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  FolderKanban,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { PillButton } from '@/components/ui/button';
import { useData } from '@/context/data-context';

export default function AnalyticsPage() {
  const { projects, tasks, reports, profiles } = useData();
  const [metricFilter, setMetricFilter] = React.useState('All');

  const [today, setToday] = React.useState('2026-10-17');

  React.useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.due_date < today
  );
  const blockedTasks = tasks.filter((t) => t.status === 'blocked');

  // Chart: Tasks by Status
  const statusData = [
    { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: '#94a3b8' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length, color: '#0d9488' },
    { name: 'Blocked', value: blockedTasks.length, color: '#ef4444' },
    { name: 'In Review', value: tasks.filter((t) => t.status === 'in_review').length, color: '#f59e0b' },
    { name: 'Completed', value: completedTasks.length, color: '#10b981' },
  ];

  // Chart: Project Completion %
  const projectProgressData = projects.map((p) => ({
    name: p.name.length > 15 ? p.name.slice(0, 13) + '...' : p.name,
    completion: p.progress,
  }));

  // Chart: Employee Workload (tasks per person)
  const workloadData = profiles.map((p) => {
    const assigned = tasks.filter((t) => t.assignee_ids?.includes(p.id));
    const done = assigned.filter((t) => t.status === 'completed');
    return {
      name: p.full_name.split(' ')[0],
      total: assigned.length,
      completed: done.length,
      pending: assigned.length - done.length,
    };
  });

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <WorkspaceShell
      title="Company Analytics & Performance"
      description="Data-driven insights across team velocity, deliverable completion, and workload distribution"
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER (MATCHING REFERENCE WORKSPACE DETAILS)         */}
      {/* ============================================================== */}
      <PageTopHeader
        title="ANALYTICS"
        actionButton={
          <PillButton variant="black" size="md">
            Export Report
          </PillButton>
        }
        metrics={[
          { value: `${completionRate}%`, label: 'Velocity', trend: '↑ 12%', trendType: 'lime' },
          { value: '645h', label: 'Logged', trend: 'On Target', trendType: 'orange' },
          { value: blockedTasks.length, label: 'Blockers', trend: '↓ 2', trendType: 'negative' },
        ]}
        categoryLabel="Executive Insights"
        categoryCount="Q4 2026"
        filters={['All', 'Throughput', 'Workload', 'Velocity', 'Milestones']}
        activeFilter={metricFilter}
        onFilterChange={setMetricFilter}
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Overall Task Velocity
          </span>
          <div className="text-2xl font-bold text-neutral-900 mt-2">
            {Math.round((completedTasks.length / tasks.length) * 100)}%
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {completedTasks.length} of {tasks.length} total tasks completed
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Active Deliverables
          </span>
          <div className="text-2xl font-bold text-neutral-900 mt-2">{projects.length}</div>
          <p className="text-xs text-teal-600 font-medium mt-1">100% on active milestone schedule</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Report Compliance
          </span>
          <div className="text-2xl font-bold text-teal-700 mt-2">
            {Math.round((reports.filter((r) => r.status !== 'draft').length / profiles.length) * 100)}%
          </div>
          <p className="text-xs text-neutral-500 mt-1">Weekly Friday submission rate</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Risk & Overdue Index
          </span>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {overdueTasks.length + blockedTasks.length}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Requires management facilitation</p>
        </div>
      </div>

      {/* Row 1 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Project Completion */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 mb-1">Project Completion Rates</h3>
          <p className="text-xs text-neutral-400 mb-6">Percentage completed per active stream</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData} barSize={32}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Progress']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="completion" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Task Status Breakdown</h3>
            <p className="text-xs text-neutral-400 mb-4">Current state of {tasks.length} tasks</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-100 text-xs">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-neutral-500 truncate">{s.name}:</span>
                <span className="font-bold text-neutral-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Team Workload Overview */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-1">Team Member Workload Balance</h3>
        <p className="text-xs text-neutral-400 mb-6">
          Assigned vs completed tasks per team member
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending Tasks" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WorkspaceShell>
  );
}
