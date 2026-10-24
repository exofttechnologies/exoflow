'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Plus,
  Search,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  LayoutGrid,
  Table as TableIcon,
  ArrowUpRight,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { PriorityLevel, ProjectStatus } from '@/types/database';
import { PillButton, CircleButton } from '@/components/ui/button';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { projects, tasks, profiles, createProject, projectDrafts, deleteProjectDraft } = useData();
  const [today, setToday] = useState('2026-10-17');

  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New project state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('medium');
  const [newDeadline, setNewDeadline] = useState('');

  // Filter projects by search and category pills
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client_name && p.client_name.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesFilter = true;
    if (statusFilter === 'Active') matchesFilter = p.status === 'active';
    else if (statusFilter === 'Internal') matchesFilter = p.client_name?.toLowerCase().includes('internal') ?? false;
    else if (statusFilter === 'Enterprise') matchesFilter = p.client_name?.toLowerCase().includes('nexus') || p.client_name?.toLowerCase().includes('enterprise') || false;
    else if (statusFilter === 'Archived') matchesFilter = p.status === 'archived';

    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    createProject({
      name: newName,
      description: newDescription,
      client_name: newClientName || 'Internal (Exoft)',
      priority: newPriority,
      deadline: newDeadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'active',
      member_ids: [profiles[0].id, profiles[2].id, profiles[3].id],
    });

    setNewName('');
    setNewDescription('');
    setNewClientName('');
    setShowCreateModal(false);
  };

  // Metrics for Top Header
  const activeCount = projects.filter((p) => p.status === 'active').length;
  const avgProgress = Math.round(
    projects.reduce((acc, p) => acc + (p.progress || 0), 0) / (projects.length || 1)
  );
  const totalTasksCount = tasks.length;

  return (
    <WorkspaceShell
      title="Company Projects"
      description="Track milestones, client deliverables, resource allocations, and completion velocity"
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER (MATCHING REFERENCE WORKSPACE LAYOUT)          */}
      {/* ============================================================== */}
      <PageTopHeader
        title="PROJECTS"
        actionButton={
          isAdmin && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <PillButton
                variant="black"
                size="sm"
                className="sm:text-xs"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => router.push('/projects/new')}
              >
                New Project
              </PillButton>
              <PillButton
                variant="white"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => setShowCreateModal(true)}
              >
                Quick Create
              </PillButton>
            </div>
          )
        }
        metrics={[
          { value: projects.length, label: 'Projects', trend: `↑ ${activeCount} Active`, trendType: 'lime' },
          { value: `${avgProgress}%`, label: 'Velocity', trend: '↑ 8%', trendType: 'orange' },
          { value: totalTasksCount, label: 'Deliverables', trend: '15 Total', trendType: 'positive' },
        ]}
        categoryLabel="Client Deliverables"
        categoryCount={`${filteredProjects.length} Streams`}
        filters={['All', 'Active', 'Enterprise', 'Internal', 'Archived']}
        activeFilter={statusFilter}
        onFilterChange={(f) => setStatusFilter(f)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search project name, client, tech..."
      />

      {/* View Switcher & Quick Helper Bar */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <p className="text-xs font-semibold text-neutral-500">
          Click any project card to open its <strong className="text-neutral-900 font-bold">dedicated details page</strong> with live product status, team members, and employee task progress.
        </p>
        <div className="flex items-center bg-white border border-neutral-200 rounded-full p-0.5 shadow-2xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 px-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'grid' ? 'bg-neutral-950 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 px-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'table' ? 'bg-neutral-950 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
            title="Table View"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* GRID VIEW (CLICKABLE CARDS NAVIGATING TO SEPARATE PAGE)       */}
      {/* ============================================================== */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => {
            const projectTasks = tasks.filter((t) => t.project_id === project.id);
            const completedCount = projectTasks.filter((t) => t.status === 'completed').length;
            const inProgressCount = projectTasks.filter((t) => t.status === 'in_progress').length;
            const blockedCount = projectTasks.filter((t) => t.status === 'blocked').length;
            const overdueCount = projectTasks.filter(
              (t) => t.status !== 'completed' && t.due_date < today
            ).length;
            const members = profiles.filter((p) => project.member_ids?.includes(p.id));

            // Give the first card the signature lime spotlight accent!
            const isLimeSpotlight = idx === 0;

            return (
              <div
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className={`p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] border transition-all flex flex-col justify-between cursor-pointer group hover:scale-[1.01] hover:shadow-md relative select-none ${
                  isLimeSpotlight
                    ? 'bg-[#d4f940] border-[#c2e831] shadow-sm text-neutral-950 ring-1 ring-[#c2e831]'
                    : 'bg-white border-neutral-200/80 shadow-xs hover:border-neutral-950 text-neutral-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold ${isLimeSpotlight ? 'text-neutral-900/80' : 'text-neutral-400'}`}>
                        Client: {project.client_name || 'Exoft Internal'}
                      </span>
                      {project.modules && project.modules.length > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isLimeSpotlight ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {project.modules.length} Modules
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          isLimeSpotlight
                            ? 'bg-neutral-950 text-white'
                            : project.status === 'active'
                            ? 'bg-[#d4f940] text-neutral-950 font-bold'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {project.status}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                          isLimeSpotlight ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-extrabold tracking-tight group-hover:underline decoration-neutral-950">
                    {project.name}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isLimeSpotlight ? 'text-neutral-900/90 font-medium' : 'text-neutral-500'}`}>
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Progress Bar (Thick Capsule Style) */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                      <span>Product Progress</span>
                      <span className="text-sm font-extrabold">{project.progress}%</span>
                    </div>
                    <div
                      className={`w-full rounded-full h-3 overflow-hidden p-0.5 ${
                        isLimeSpotlight ? 'bg-neutral-950/15' : 'bg-neutral-100'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLimeSpotlight ? 'bg-neutral-950' : 'bg-[#d4f940]'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics and Deadlines */}
                  <div
                    className={`flex items-center justify-between pt-3 text-xs font-medium border-t ${
                      isLimeSpotlight ? 'border-neutral-950/10' : 'border-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{projectTasks.length} tasks</span>
                      <span>•</span>
                      <span>{completedCount} done</span>
                      {blockedCount > 0 && (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {blockedCount} blocked
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{project.deadline}</span>
                    </div>
                  </div>

                  {/* Team Avatars & View Details Link */}
                  <div
                    className={`flex items-center justify-between pt-3 border-t ${
                      isLimeSpotlight ? 'border-neutral-950/10' : 'border-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {members.map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar_url}
                            alt={m.full_name}
                            title={`${m.full_name} — ${m.designation}`}
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold">
                        {members.length} team members
                      </span>
                    </div>

                    <span className={`text-[11px] font-extrabold flex items-center gap-1 ${
                      isLimeSpotlight ? 'text-neutral-950' : 'text-neutral-600 group-hover:text-neutral-950'
                    }`}>
                      Inspect Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ============================================================== */
        /* TABLE VIEW                                                    */
        /* ============================================================== */
        <div className="bg-white rounded-[28px] border border-neutral-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Project</th>
                <th className="p-4">Client</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Team</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProjects.map((p) => {
                const members = profiles.filter((m) => p.member_ids?.includes(m.id));
                return (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/projects/${p.id}`)}
                    className="hover:bg-neutral-50/80 transition-all cursor-pointer group"
                  >
                    <td className="p-4 font-bold text-neutral-900 group-hover:text-neutral-950">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900" />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-600 font-medium">{p.client_name || 'Exoft'}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          p.priority === 'urgent'
                            ? 'bg-red-100 text-red-700'
                            : p.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {p.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          p.status === 'active'
                            ? 'bg-[#d4f940] text-neutral-950 font-bold'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-neutral-950 h-full rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="font-extrabold">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-neutral-700">{p.deadline}</td>
                    <td className="p-4">
                      <div className="flex -space-x-1.5">
                        {members.map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar_url}
                            alt={m.full_name}
                            title={m.full_name}
                            className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-950 underline underline-offset-2">
                        Inspect Details →
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* CREATE NEW PROJECT MODAL                                       */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-neutral-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-md w-full p-5 sm:p-7 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 max-h-[88vh] overflow-y-auto touch-scroll">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <h3 className="text-lg font-extrabold text-neutral-950">
                Initiate New Project Pipeline
              </h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-4 h-4" />
              </CircleButton>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. NextGen Mobile Banking"
                  required
                  className="w-full p-3 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Client Name (Optional)
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. FinTech Solutions LLC"
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
                  placeholder="Scope, deliverables, and architecture overview..."
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
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
                  Create Project
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
