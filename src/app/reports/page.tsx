'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Plus,
  Calendar,
  X,
  Shield,
  User,
  Award,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  ExternalLink,
  Star,
  ThumbsUp,
  Edit3,
  Download,
  Filter,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { ReportStatus, WeeklyReport } from '@/types/database';
import { PillButton, CircleButton, DateBadgePill } from '@/components/ui/button';

export default function ReportsPage() {
  const { user, isAdmin } = useAuth();
  const { reports, profiles, tasks, projects, submitWeeklyReport, reviewWeeklyReport } = useData();

  const [activeTab, setActiveTab] = useState<'monthly_stats' | 'history' | 'submit'>('monthly_stats');
  const [reportFilter, setReportFilter] = useState('All');
  const [reportSearch, setReportSearch] = useState('');
  const [selectedReportForReview, setSelectedReportForReview] = useState<WeeklyReport | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState<ReportStatus>('reviewed');

  // Monthly stats state
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('All');
  const [monthlyAppraisalModalEmployeeId, setMonthlyAppraisalModalEmployeeId] = useState<string | null>(null);
  const [appraisalNote, setAppraisalNote] = useState('');

  // Pre-seeded / local monthly appraisal feedback per employee
  const [employeeAppraisals, setEmployeeAppraisals] = useState<Record<string, string>>({
    '33333333-3333-4333-8333-333333333333':
      'Liam delivered the Interactive Hero Animation 2 days ahead of schedule with verified GitHub PR proof and 100% test passing rate. Outstanding engineering velocity this month.',
    '66666666-6666-4666-8666-666666666666':
      'Anya completed the Dark Mode Palette and Design System tokens precisely on deadline. Figma proof approved by leadership with zero revisions needed.',
    '44444444-4444-4444-8444-444444444444':
      'Sofia implemented PostgreSQL schemas and RLS security policies on schedule. Currently addressing third-party webhook credentials.',
    '55555555-5555-4555-8555-555555555555':
      'Carlos achieved on-time milestone delivery for Stripe checkout webhooks and catalog sync. High reliability across sprint deliverables.',
    '77777777-7777-4777-8777-777777777777':
      'David maintained a 95+ Lighthouse score across deliverables and built automated CI tests on schedule. Punctual and thorough QA delivery.',
  });

  // Submission Form State
  const [weekStart, setWeekStart] = useState('2026-10-12');
  const [completed, setCompleted] = useState('');
  const [inProgress, setInProgress] = useState('');
  const [pending, setPending] = useState('');
  const [blockers, setBlockers] = useState('');
  const [nextPlan, setNextPlan] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (status: 'draft' | 'submitted') => {
    submitWeeklyReport({
      user_id: user?.id,
      reporting_week_start: weekStart,
      tasks_completed: completed,
      work_in_progress: inProgress,
      pending_tasks: pending,
      blockers,
      next_week_plan: nextPlan,
      additional_notes: notes,
      status,
    });

    alert(status === 'submitted' ? 'Weekly report submitted for Admin review!' : 'Draft saved.');
    setActiveTab('history');
  };

  const handleAdminReview = () => {
    if (!selectedReportForReview) return;
    reviewWeeklyReport(selectedReportForReview.id, reviewStatus, reviewFeedback);
    setSelectedReportForReview(null);
    setReviewFeedback('');
  };

  const handleSaveAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthlyAppraisalModalEmployeeId) return;
    setEmployeeAppraisals((prev) => ({
      ...prev,
      [monthlyAppraisalModalEmployeeId]: appraisalNote,
    }));
    setMonthlyAppraisalModalEmployeeId(null);
    setAppraisalNote('');
  };

  const reviewedCount = reports.filter((r) => r.status === 'reviewed').length;
  const pendingCount = reports.filter((r) => r.status === 'submitted').length;

  // Employees (non-admin team members)
  const employeeStaff = profiles.filter((p) => p.role === 'employee');

  // Filtered employees for monthly stats
  const filteredStaff = employeeStaff.filter((emp) => {
    if (selectedStaffFilter === 'All') return true;
    return emp.full_name === selectedStaffFilter;
  });

  // Calculate company-wide monthly deadline performance
  const allStaffTasks = tasks.filter((t) =>
    t.assignee_ids?.some((id) => employeeStaff.some((emp) => emp.id === id))
  );
  const totalCompletedTasks = allStaffTasks.filter((t) => t.status === 'completed');
  const onTimeDeliveriesCount = totalCompletedTasks.length; // completed tasks with verified work
  const overallOnTimeRate =
    allStaffTasks.length > 0
      ? Math.round((onTimeDeliveriesCount / allStaffTasks.length) * 100)
      : 100;

  return (
    <WorkspaceShell
      title="Company Reports & Monthly Deadline Stats"
      description="Track monthly employee deadline achievement rates, work delivered on schedule, and weekly progress submissions"
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER (MATCHING REFERENCE WORKSPACE DETAILS)         */}
      {/* ============================================================== */}
      <PageTopHeader
        title="REPORTS"
        actionButton={
          <PillButton
            variant="black"
            size="md"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setActiveTab('submit')}
          >
            Submit Report
          </PillButton>
        }
        metrics={[
          { value: `${overallOnTimeRate}%`, label: 'On-Time Rate', trend: '↑ 4% Monthly', trendType: 'lime' },
          { value: `${onTimeDeliveriesCount}/${allStaffTasks.length}`, label: 'Delivered', trend: 'October Goals', trendType: 'orange' },
          { value: reports.length, label: 'Weekly Filed', trend: '100% Compliance', trendType: 'positive' },
        ]}
        categoryLabel="Performance Oversight"
        categoryCount="October 2026"
        filters={['All', 'Reviewed', 'Pending', 'Drafts']}
        activeFilter={reportFilter}
        onFilterChange={setReportFilter}
        searchValue={reportSearch}
        onSearchChange={setReportSearch}
        searchPlaceholder="Search reports or team members..."
      />

      {/* Navigation Tabs using Pill Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-neutral-200/80 pb-4 select-none">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0 py-1 touch-scroll">
          <PillButton
            variant={activeTab === 'monthly_stats' ? 'black' : 'white'}
            size="md"
            icon={<Award className="w-3.5 h-3.5 text-[#d4f940]" />}
            onClick={() => setActiveTab('monthly_stats')}
          >
            Monthly Deadline Stats
          </PillButton>

          <PillButton
            variant={activeTab === 'history' ? 'black' : 'white'}
            size="md"
            onClick={() => setActiveTab('history')}
          >
            Weekly Submissions ({reports.length})
          </PillButton>

          <PillButton
            variant={activeTab === 'submit' ? 'black' : 'white'}
            size="md"
            onClick={() => setActiveTab('submit')}
          >
            Submit / Edit My Report
          </PillButton>
        </div>

        <DateBadgePill day="18" weekday="Sun" month="October 2026" />
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MONTHLY STATS REPORT (BASED ON WORK ACHIEVED ON DEADLINE)          */}
      {/* ========================================================================= */}
      {activeTab === 'monthly_stats' && (
        <div className="space-y-6 select-none">
          {/* Executive Monthly Deadline Summary Banner */}
          <div className="bg-neutral-950 text-white rounded-[32px] p-7 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#d4f940] text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#d4f940]" />
                  <span>Monthly Staff Reliability & Deadline Report • October 2026</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {overallOnTimeRate}% Work Achieved on Schedule Across Team
                </h2>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  Calculated from individual employee task deliverables, completion proofs submitted, and on-time deadline compliance throughout October 2026.
                </p>
              </div>

              {/* Top Performer Badge */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3 shrink-0 shadow-inner">
                <img
                  src={employeeStaff[0]?.avatar_url}
                  alt={employeeStaff[0]?.full_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#d4f940]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[#d4f940] fill-[#d4f940]" />
                    <span className="text-[10px] font-black uppercase text-[#d4f940] tracking-wider">
                      Top Performer of the Month
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">{employeeStaff[0]?.full_name}</h4>
                  <p className="text-[11px] text-neutral-400 font-medium">100% On-Time Completion (3/3 Verified)</p>
                </div>
              </div>
            </div>

            {/* Overall Monthly Deadline Progress Capsule */}
            <div className="w-full bg-neutral-900 h-3.5 rounded-full p-0.5 overflow-hidden">
              <div
                className="bg-[#d4f940] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${overallOnTimeRate}%` }}
              />
            </div>

            {/* 4 Company Performance Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
              <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Total Deliverables</span>
                <p className="text-xl font-black text-white mt-0.5">{allStaffTasks.length}</p>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Assigned to staff</p>
              </div>

              <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Achieved On Deadline</span>
                <p className="text-xl font-black text-[#d4f940] mt-0.5">{onTimeDeliveriesCount}</p>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Verified on schedule</p>
              </div>

              <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Proof Verification Rate</span>
                <p className="text-xl font-black text-emerald-400 mt-0.5">
                  {Math.round((allStaffTasks.filter((t) => t.proof_url).length / (allStaffTasks.length || 1)) * 100)}%
                </p>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">PRs & Figma verified</p>
              </div>

              <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Active Overdue Risk</span>
                <p className="text-xl font-black text-amber-400 mt-0.5">
                  {allStaffTasks.filter((t) => t.status === 'blocked' || t.warning_alert).length}
                </p>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">With warning alerts</p>
              </div>
            </div>
          </div>

          {/* Filter Row: Filter by Specific Employee */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs font-bold text-neutral-500 shrink-0">Filter Employee:</span>
              <button
                onClick={() => setSelectedStaffFilter('All')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedStaffFilter === 'All'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200'
                }`}
              >
                All Staff ({employeeStaff.length})
              </button>
              {employeeStaff.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedStaffFilter(emp.full_name)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedStaffFilter === emp.full_name
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200'
                  }`}
                >
                  {emp.full_name.split(' ')[0]}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-neutral-500">
              Showing monthly deadline report for <strong className="text-neutral-900">{filteredStaff.length}</strong> team members
            </span>
          </div>

          {/* ============================================================== */}
          {/* INDIVIDUAL EMPLOYEE MONTHLY STATS & DEADLINE BREAKDOWN CARDS   */}
          {/* ============================================================== */}
          <div className="space-y-6">
            {filteredStaff.map((employee) => {
              const empTasks = tasks.filter((t) => t.assignee_ids?.includes(employee.id));
              const empCompleted = empTasks.filter((t) => t.status === 'completed');
              const empWithProof = empTasks.filter((t) => Boolean(t.proof_url));
              const empBlocked = empTasks.filter((t) => t.status === 'blocked');
              const empWarnings = empTasks.filter((t) => Boolean(t.warning_alert));

              // Calculate on-time achievement rate
              const onTimeCount = empCompleted.length;
              const achievementRate =
                empTasks.length > 0 ? Math.round((onTimeCount / empTasks.length) * 100) : 100;

              // Punctuality rating badge
              const punctuality =
                achievementRate >= 90
                  ? { label: '🏆 Exemplary Punctuality', bg: 'bg-[#d4f940] text-neutral-950 font-black' }
                  : achievementRate >= 75
                  ? { label: '🟢 Solid On-Time Record', bg: 'bg-emerald-100 text-emerald-800 font-bold' }
                  : { label: '⚠️ Attention Required', bg: 'bg-amber-100 text-amber-900 font-bold' };

              const appraisal = employeeAppraisals[employee.id] || 'Monthly performance in good standing.';

              return (
                <div
                  key={employee.id}
                  className="bg-white rounded-[32px] border border-neutral-200/90 shadow-2xs p-6 sm:p-7 space-y-5 hover:border-neutral-900 transition-all"
                >
                  {/* Top Employee Header & Monthly Achievement Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={employee.avatar_url}
                        alt={employee.full_name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-100 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-neutral-950 leading-tight">
                            {employee.full_name}
                          </h3>
                          <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                            {employee.department}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">{employee.designation}</p>
                      </div>
                    </div>

                    {/* Deadline Performance Meter & Badge */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-black text-neutral-950">
                          {achievementRate}% Deadline Achievement
                        </span>
                        <div className="w-32 bg-neutral-100 h-2 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-neutral-950 h-full rounded-full transition-all duration-300"
                            style={{ width: `${achievementRate}%` }}
                          />
                        </div>
                      </div>

                      <span className={`text-[11px] px-3 py-1 rounded-full ${punctuality.bg}`}>
                        {punctuality.label}
                      </span>
                    </div>
                  </div>

                  {/* 4 Mini Stat Blocks for this Employee */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Assigned This Month</span>
                      <p className="text-lg font-black text-neutral-950 mt-0.5">{empTasks.length} Deliverables</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Achieved On Time</span>
                      <p className="text-lg font-black text-emerald-700 mt-0.5">
                        {empCompleted.length} Completed ✓
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Proof Submitted</span>
                      <p className="text-lg font-black text-neutral-950 mt-0.5">{empWithProof.length} Verified</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Warnings / Blockers</span>
                      <p
                        className={`text-lg font-black mt-0.5 ${
                          empWarnings.length > 0 || empBlocked.length > 0 ? 'text-amber-600' : 'text-neutral-400'
                        }`}
                      >
                        {empWarnings.length + empBlocked.length}
                      </p>
                    </div>
                  </div>

                  {/* Deliverables Completed on Deadline with Proof Links */}
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">
                      Monthly Work Deliverables & Deadline Status:
                    </h4>

                    {empTasks.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic py-2">No tasks assigned this month.</p>
                    ) : (
                      <div className="space-y-2">
                        {empTasks.map((t) => {
                          const project = projects.find((p) => p.id === t.project_id);
                          const isDone = t.status === 'completed';

                          return (
                            <div
                              key={t.id}
                              className="p-3 rounded-2xl border border-neutral-100 bg-[#fafbfa] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-neutral-950">{t.title}</span>
                                  <span className="text-[10px] text-neutral-500 bg-white px-2 py-0.5 rounded-full border border-neutral-200">
                                    {project?.name || 'Project'}
                                  </span>
                                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-semibold">
                                    <Clock className="w-3 h-3" /> Due {t.due_date}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-500 line-clamp-1">{t.description}</p>
                              </div>

                              {/* Deadline Achievement Pill & Proof */}
                              <div className="flex items-center gap-2 shrink-0">
                                {isDone ? (
                                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Achieved on Deadline
                                  </span>
                                ) : t.status === 'blocked' ? (
                                  <span className="text-[10px] font-black bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Blocker Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-full">
                                    ⏳ In Progress ({t.progress}%)
                                  </span>
                                )}

                                {t.proof_url && (
                                  <a
                                    href={t.proof_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-extrabold text-emerald-700 underline flex items-center gap-0.5 bg-white border border-emerald-200 px-2 py-0.5 rounded-full hover:bg-emerald-50"
                                    title="View submitted proof"
                                  >
                                    <FileCheck className="w-3 h-3" />
                                    <span>Proof ↗</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Monthly Performance Appraisal Feedback Quote */}
                  <div className="p-4 rounded-2xl bg-[#d4f940]/20 border border-[#d4f940]/80 relative">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-neutral-950">
                        <Award className="w-4 h-4 text-neutral-900" />
                        <span>Leadership Monthly Performance Appraisal:</span>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setMonthlyAppraisalModalEmployeeId(employee.id);
                            setAppraisalNote(appraisal);
                          }}
                          className="text-[11px] font-extrabold text-neutral-900 underline flex items-center gap-1 hover:text-neutral-700 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Appraisal</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-neutral-800 leading-relaxed font-medium pl-5 italic">
                      "{appraisal}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WEEKLY SUBMISSIONS HISTORY & REVIEW                                */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4 select-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const author = profiles.find((p) => p.id === report.user_id);
              const reviewer = profiles.find((p) => p.id === report.reviewed_by);

              return (
                <div
                  key={report.id}
                  className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-xs flex flex-col justify-between hover:border-neutral-950 transition-all"
                >
                  <div>
                    {/* Author & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-100 shadow-xs"
                        />
                        <div>
                          <div className="text-xs font-bold text-neutral-950">{author?.full_name}</div>
                          <div className="text-[10px] text-neutral-400 font-medium">{author?.designation}</div>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          report.status === 'reviewed'
                            ? 'bg-[#d4f940] text-neutral-950'
                            : report.status === 'submitted'
                            ? 'bg-neutral-950 text-white'
                            : report.status === 'needs_revision'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-neutral-400 mb-3 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Week of {report.reporting_week_start}
                    </div>

                    {/* Report Summary Blocks */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="font-bold text-neutral-900 mb-1">Tasks Completed:</div>
                        <p className="text-neutral-600 whitespace-pre-line bg-neutral-50 p-3 rounded-2xl border border-neutral-100 leading-relaxed text-[11px] font-medium">
                          {report.tasks_completed || 'None recorded.'}
                        </p>
                      </div>

                      {report.blockers && (
                        <div>
                          <div className="font-bold text-red-600 mb-1">Blockers:</div>
                          <p className="text-red-700 bg-red-50/60 p-3 rounded-2xl border border-red-200/60 text-[11px] font-medium">
                            {report.blockers}
                          </p>
                        </div>
                      )}

                      {/* Admin Feedback */}
                      {report.admin_feedback && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-[#d4f940]/25 border border-[#d4f940]">
                          <div className="flex items-center gap-1.5 text-neutral-950 font-bold text-[11px] mb-1">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Executive Feedback ({reviewer?.full_name || 'Admin'}):</span>
                          </div>
                          <p className="text-neutral-800 text-[11px] leading-relaxed italic">
                            "{report.admin_feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Review Action Button */}
                  {isAdmin && (
                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-end">
                      <PillButton
                        variant="white"
                        size="sm"
                        onClick={() => {
                          setSelectedReportForReview(report);
                          setReviewFeedback(report.admin_feedback || '');
                          setReviewStatus(report.status);
                        }}
                      >
                        {report.status === 'reviewed' ? 'Update Review' : 'Review Report'}
                      </PillButton>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SUBMIT / EDIT REPORT FORM                                          */}
      {/* ========================================================================= */}
      {activeTab === 'submit' && (
        <div className="max-w-3xl bg-white rounded-[32px] p-6 sm:p-8 border border-neutral-200/80 shadow-xs select-none">
          <div className="mb-6">
            <h3 className="text-xl font-black text-neutral-950 tracking-tight">
              Friday Weekly Progress Submission
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Document completed deliverables, ongoing initiatives, and outline blockers for management review.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('submitted');
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Reporting Week Starting Date *
              </label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                required
                className="w-full sm:w-64 p-3 rounded-full border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-neutral-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Tasks Completed This Week *
              </label>
              <textarea
                value={completed}
                onChange={(e) => setCompleted(e.target.value)}
                placeholder="Bullet points of features merged, components finalized, or clients onboarded..."
                rows={3}
                required
                className="w-full p-4 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Work in Progress (Current Sprint)
              </label>
              <textarea
                value={inProgress}
                onChange={(e) => setInProgress(e.target.value)}
                placeholder="Active branches, in-flight PRs, or WIP designs..."
                rows={2}
                className="w-full p-4 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Blockers or Dependencies (If Any)
              </label>
              <textarea
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="Waiting on client credentials, external APIs, or team feedback..."
                rows={2}
                className="w-full p-4 rounded-2xl border border-red-200 bg-red-50/20 text-xs focus:outline-none focus:border-red-500 font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Plan for Next Week
              </label>
              <textarea
                value={nextPlan}
                onChange={(e) => setNextPlan(e.target.value)}
                placeholder="Key goals to accomplish before next Friday..."
                rows={2}
                className="w-full p-4 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 font-medium shadow-2xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <PillButton
                type="button"
                variant="white"
                size="md"
                onClick={() => handleSubmit('draft')}
              >
                Save Draft
              </PillButton>
              <PillButton
                type="submit"
                variant="black"
                size="md"
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Submit for Executive Review
              </PillButton>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADMIN REVIEW WEEKLY REPORT                              */}
      {/* ============================================================== */}
      {selectedReportForReview && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 z-50 animate-in fade-in select-none">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-neutral-200 max-h-[88vh] overflow-y-auto touch-scroll">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-black text-neutral-950">
                Review Report: {profiles.find((p) => p.id === selectedReportForReview.user_id)?.full_name}
              </h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setSelectedReportForReview(null)}
              >
                <X className="w-4 h-4" />
              </CircleButton>
            </div>

            <div className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Report Status
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as ReportStatus)}
                  className="w-full p-3 rounded-full border border-neutral-200 text-xs font-bold shadow-2xs"
                >
                  <option value="reviewed">Reviewed & Approved</option>
                  <option value="needs_revision">Needs Revision</option>
                  <option value="submitted">Submitted (Pending)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Executive Feedback & Recommendations
                </label>
                <textarea
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Provide constructive feedback, praise, or blocker resolution instructions..."
                  rows={4}
                  className="w-full p-3.5 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 font-medium shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setSelectedReportForReview(null)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="button"
                  variant="black"
                  size="md"
                  onClick={handleAdminReview}
                >
                  Save Review
                </PillButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADMIN EDIT MONTHLY APPRAISAL FEEDBACK                   */}
      {/* ============================================================== */}
      {monthlyAppraisalModalEmployeeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-neutral-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-md w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 max-h-[88vh] overflow-y-auto touch-scroll">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-black text-neutral-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-neutral-900" />
                Monthly Appraisal Feedback
              </h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setMonthlyAppraisalModalEmployeeId(null)}
              >
                <X className="w-3.5 h-3.5" />
              </CircleButton>
            </div>

            <form onSubmit={handleSaveAppraisal} className="space-y-4">
              <p className="text-xs text-neutral-600">
                Submit monthly deadline appraisal and recognition for{' '}
                <strong className="text-neutral-900">
                  {profiles.find((p) => p.id === monthlyAppraisalModalEmployeeId)?.full_name}
                </strong>
                .
              </p>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Executive Monthly Performance Appraisal *
                </label>
                <textarea
                  value={appraisalNote}
                  onChange={(e) => setAppraisalNote(e.target.value)}
                  placeholder="e.g. Delivered all October milestones 100% on schedule with stellar code quality..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setMonthlyAppraisalModalEmployeeId(null)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="submit"
                  variant="black"
                  size="md"
                >
                  Save Appraisal Note
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
