'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  FolderKanban,
  Plus,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Briefcase,
  Edit3,
  ArrowLeft,
  ShieldAlert,
  FileCheck,
  CheckSquare,
  Square,
  FileText,
  Sparkles,
  Layers,
  DollarSign,
  Sliders,
  Check,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { PriorityLevel, TaskStatus } from '@/types/database';
import { PillButton, CircleButton } from '@/components/ui/button';

function ProjectDetailContent() {
  const params = useParams();
  const projectId = (params?.id as string) || '';
  const router = useRouter();

  const { user, isAdmin } = useAuth();
  const {
    projects,
    tasks,
    profiles,
    updateProject,
    updateTaskStatus,
    createTask,
    addWarningAlert,
    clearWarningAlert,
    submitTaskProof,
    toggleTaskComplete,
  } = useData();

  const project = projects.find((p) => p.id === projectId);

  // The two core pills requested: 'Project Details' and 'Project Progress'
  const [activeTab, setActiveTab] = useState<'Project Details' | 'Project Progress'>('Project Details');

  // Edit Project Details Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<PriorityLevel>('medium');
  const [editDeadline, setEditDeadline] = useState('');
  const [editScope, setEditScope] = useState('');
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [editModules, setEditModules] = useState<string[]>([]);
  const [newModuleInput, setNewModuleInput] = useState('');
  const [editOtherRequirements, setEditOtherRequirements] = useState('');
  const [editEstimate, setEditEstimate] = useState('');

  // Modals for Task Management
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Warning Alert Modal for Admin
  const [warningModalTaskId, setWarningModalTaskId] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState('');

  // Proof Modal for Employee
  const [proofModalTaskId, setProofModalTaskId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [proofNote, setProofNote] = useState('');

  if (!project) {
    return (
      <WorkspaceShell title="Project Not Found">
        <div className="text-center py-20 space-y-4">
          <FolderKanban className="w-12 h-12 text-neutral-300 mx-auto" />
          <h2 className="text-2xl font-black text-neutral-900">Project Not Found</h2>
          <p className="text-xs text-neutral-500">
            The project with ID "{projectId}" does not exist or has been removed.
          </p>
          <Link href="/projects">
            <PillButton variant="black" size="md">
              ← Return to Projects
            </PillButton>
          </Link>
        </div>
      </WorkspaceShell>
    );
  }

  // Filter tasks belonging to this project
  const projectTasks = tasks.filter((t) => t.project_id === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'completed');
  const blockedTasks = projectTasks.filter((t) => t.status === 'blocked');
  const inProgressTasks = projectTasks.filter((t) => t.status === 'in_progress');

  // Team members allocated to this project
  const projectMembers = profiles.filter(
    (p) =>
      project.member_ids?.includes(p.id) ||
      projectTasks.some((t) => t.assignee_ids?.includes(p.id))
  );

  // Initialize edit form when opening modal
  const openEditModal = () => {
    setEditName(project.name);
    setEditClientName(project.client_name || '');
    setEditDescription(project.description || '');
    setEditPriority(project.priority);
    setEditDeadline(project.deadline);
    setEditScope(project.scope || '');
    setEditFeatures(project.features || []);
    setEditModules(project.modules || []);
    setEditOtherRequirements(project.other_requirements || '');
    setEditEstimate(project.estimate || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updateProject(project.id, {
      name: editName.trim(),
      client_name: editClientName.trim() || 'Internal (Exoft)',
      description: editDescription.trim(),
      priority: editPriority,
      deadline: editDeadline,
      scope: editScope.trim(),
      features: editFeatures,
      modules: editModules,
      other_requirements: editOtherRequirements.trim(),
      estimate: editEstimate.trim(),
    });

    setShowEditModal(false);
  };

  const handleAddFeatureInEdit = () => {
    const trimmed = newFeatureInput.trim();
    if (!trimmed) return;
    if (!editFeatures.includes(trimmed)) {
      setEditFeatures([...editFeatures, trimmed]);
    }
    setNewFeatureInput('');
  };

  const handleRemoveFeatureInEdit = (feat: string) => {
    setEditFeatures(editFeatures.filter((f) => f !== feat));
  };

  const handleAddModuleInEdit = () => {
    const trimmed = newModuleInput.trim();
    if (!trimmed) return;
    if (!editModules.includes(trimmed)) {
      setEditModules([...editModules, trimmed]);
    }
    setNewModuleInput('');
  };

  const handleRemoveModuleInEdit = (mod: string) => {
    setEditModules(editModules.filter((m) => m !== mod));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const chosenAssignee = profiles.find((p) => p.id === taskAssigneeId);

    createTask({
      project_id: project.id,
      title: taskTitle,
      description: taskDescription,
      priority: taskPriority,
      status: 'todo',
      due_date: taskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignee_ids: taskAssigneeId ? [taskAssigneeId] : [],
      assignees: chosenAssignee ? [chosenAssignee] : [],
    });

    setTaskTitle('');
    setTaskDescription('');
    setShowAddTaskModal(false);
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

  return (
    <WorkspaceShell
      title={project.name}
      description={`Client: ${project.client_name || 'Exoft Internal'} • Target Deadline: ${project.deadline}`}
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER WITH ONLY TWO REQUESTED PILLS                  */}
      {/* ============================================================== */}
      <PageTopHeader
        title={project.name.toUpperCase()}
        actionButton={
          <div className="flex items-center gap-2">
            <Link href="/projects">
              <PillButton variant="white" size="md" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                All Projects
              </PillButton>
            </Link>
            <PillButton
              variant="white"
              size="md"
              icon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={openEditModal}
            >
              Edit Details
            </PillButton>
            {isAdmin && (
              <PillButton
                variant="black"
                size="md"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setTaskAssigneeId(projectMembers[0]?.id || profiles[2]?.id || '');
                  setShowAddTaskModal(true);
                }}
              >
                Assign Task
              </PillButton>
            )}
          </div>
        }
        metrics={[
          { value: `${project.progress}%`, label: 'Velocity', trend: 'Live Progress', trendType: 'lime' },
          { value: projectTasks.length, label: 'Tasks', trend: `${completedTasks.length} Done`, trendType: 'orange' },
          { value: (project.modules || []).length, label: 'Modules', trend: 'Structured', trendType: 'positive' },
        ]}
        categoryLabel={`Workspace: ${project.name}`}
        categoryCount={`${projectTasks.length} Deliverables`}
        filters={['Project Details', 'Project Progress']}
        activeFilter={activeTab}
        onFilterChange={(f) => setActiveTab(f as 'Project Details' | 'Project Progress')}
      />

      {/* ============================================================== */}
      {/* PILL 1: PROJECT DETAILS (SCOPE, FEATURES, MODULES, ESTIMATE)    */}
      {/* ============================================================== */}
      {activeTab === 'Project Details' && (
        <div className="space-y-6 select-none">
          {/* Project Header Banner Card */}
          <div className="bg-neutral-950 text-white rounded-[32px] p-7 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Client: {project.client_name || 'Exoft Internal'}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      project.status === 'active'
                        ? 'bg-[#d4f940] text-neutral-950 font-black'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {project.status}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      project.priority === 'urgent'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : project.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {project.priority} priority
                  </span>
                  <span className="text-xs font-bold text-neutral-500">•</span>
                  <span className="text-xs font-bold text-neutral-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" /> Deadline: {project.deadline}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {project.name}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
                  {project.description || 'No description provided. Click Edit Details to add a summary.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={openEditModal}
                  className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-black text-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#d4f940]" />
                  <span>Edit Specifications</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Grid: Project Specifications Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Scope of Project */}
            <div className="bg-white border border-neutral-200/90 rounded-[28px] p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                  <h3 className="text-base font-black text-neutral-950 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-900" />
                    <span>Scope of Project</span>
                  </h3>
                  <button
                    onClick={openEditModal}
                    className="text-[11px] font-bold text-neutral-500 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {project.scope ? (
                  <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                    {project.scope}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-400 italic py-2">
                    No project scope defined yet. Click edit to add scope boundaries and deliverables.
                  </p>
                )}
              </div>
            </div>

            {/* Card 2: Project Estimate */}
            <div className="bg-white border border-neutral-200/90 rounded-[28px] p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                  <h3 className="text-base font-black text-neutral-950 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-neutral-900" />
                    <span>Project Estimate</span>
                  </h3>
                  <button
                    onClick={openEditModal}
                    className="text-[11px] font-bold text-neutral-500 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {project.estimate ? (
                  <div className="p-4 rounded-2xl bg-neutral-950 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#d4f940]">
                        Project Budget & Timeline Estimate
                      </span>
                      <p className="text-lg font-black text-white mt-0.5">
                        {project.estimate}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic py-2">
                    No estimate provided yet. Click edit to set project duration, budget, or engineering hours.
                  </p>
                )}
              </div>
            </div>

            {/* Card 3: Project Features List */}
            <div className="bg-white border border-neutral-200/90 rounded-[28px] p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                <h3 className="text-base font-black text-neutral-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-900" />
                  <span>Project Features List ({project.features?.length || 0})</span>
                </h3>
                <button
                  onClick={openEditModal}
                  className="text-[11px] font-bold text-neutral-500 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Features</span>
                </button>
              </div>

              {project.features && project.features.length > 0 ? (
                <div className="space-y-2">
                  {project.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#fafbfa] border border-neutral-200/80 rounded-2xl flex items-center gap-3 text-xs font-bold text-neutral-900"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#d4f940] text-neutral-950 text-[10px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic py-2">
                  No features added yet. Click edit to specify core project features.
                </p>
              )}
            </div>

            {/* Card 4: Modules Breakdown */}
            <div className="bg-white border border-neutral-200/90 rounded-[28px] p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                <h3 className="text-base font-black text-neutral-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-900" />
                  <span>Modules Breakdown ({project.modules?.length || 0})</span>
                </h3>
                <button
                  onClick={openEditModal}
                  className="text-[11px] font-bold text-neutral-500 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Modules</span>
                </button>
              </div>

              {project.modules && project.modules.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.modules.map((mod, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-neutral-950 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4f940]" />
                      <span>{mod}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic py-2">
                  No architectural modules specified yet. Click edit to define modules.
                </p>
              )}
            </div>

            {/* Card 5: Other Requirements */}
            <div className="bg-white border border-neutral-200/90 rounded-[28px] p-6 shadow-2xs lg:col-span-2">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                <h3 className="text-base font-black text-neutral-950 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-neutral-900" />
                  <span>Other Requirements & Technical Constraints</span>
                </h3>
                <button
                  onClick={openEditModal}
                  className="text-[11px] font-bold text-neutral-500 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              {project.other_requirements ? (
                <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                  {project.other_requirements}
                </p>
              ) : (
                <p className="text-xs text-neutral-400 italic py-2">
                  No additional technical or compliance requirements specified.
                </p>
              )}
            </div>

            {/* Card 6: Allocated Team Members */}
            <div className="bg-white border border-neutral-200/90 rounded-[28px] p-6 shadow-2xs lg:col-span-2">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                <h3 className="text-base font-black text-neutral-950 flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral-900" />
                  <span>Allocated Team Members ({projectMembers.length})</span>
                </h3>
                <span className="text-[11px] font-bold text-neutral-500">
                  Staff assigned to deliverables
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {projectMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-[#fafbfa] border border-neutral-200/80 flex items-center gap-3"
                  >
                    <img
                      src={member.avatar_url}
                      alt={member.full_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-neutral-950 truncate">{member.full_name}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{member.designation}</p>
                      <span className="text-[9px] font-bold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full inline-block mt-1">
                        {member.department}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PILL 2: PROJECT PROGRESS (OVERALL METER & EMPLOYEE TASKS)       */}
      {/* ============================================================== */}
      {activeTab === 'Project Progress' && (
        <div className="space-y-6 select-none">
          {/* Overall Progress Banner */}
          <div className="bg-neutral-950 text-white rounded-[32px] p-7 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Live Product Velocity & Delivery Progress
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  {project.progress}% Complete
                </h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Tracked by completed employee deliverables and verified proof of work.
                </p>
              </div>

              {/* Admin Quick Progress Controller */}
              {isAdmin && (
                <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1.5 rounded-full">
                  <span className="text-xs font-bold text-neutral-400 pl-2">Adjust Velocity:</span>
                  <button
                    onClick={() => updateProject(project.id, { progress: Math.min(100, project.progress + 5) })}
                    className="px-3 py-1 text-xs font-extrabold text-neutral-200 hover:text-[#d4f940] transition-all cursor-pointer"
                    title="Increase Progress +5%"
                  >
                    +5%
                  </button>
                  <button
                    onClick={() => updateProject(project.id, { progress: Math.max(0, project.progress - 5) })}
                    className="px-3 py-1 text-xs font-extrabold text-neutral-200 hover:text-red-400 transition-all cursor-pointer"
                    title="Decrease Progress -5%"
                  >
                    -5%
                  </button>
                </div>
              )}
            </div>

            {/* Thick Lime Capsule Progress Bar */}
            <div className="w-full bg-neutral-900 h-4 rounded-full p-0.5 overflow-hidden">
              <div
                className="bg-[#d4f940] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* 4 KPI Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-800/80">
              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Total Tasks</span>
                <p className="text-2xl font-black text-white mt-0.5">{projectTasks.length}</p>
              </div>
              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Completed</span>
                <p className="text-2xl font-black text-[#d4f940] mt-0.5">{completedTasks.length}</p>
              </div>
              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">In Progress</span>
                <p className="text-2xl font-black text-amber-400 mt-0.5">{inProgressTasks.length}</p>
              </div>
              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Active Blockers</span>
                <p className={`text-2xl font-black mt-0.5 ${blockedTasks.length > 0 ? 'text-red-400' : 'text-neutral-400'}`}>
                  {blockedTasks.length}
                </p>
              </div>
            </div>
          </div>

          {/* Employee Task Progress & Proof Section */}
          <div className="space-y-5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-black text-neutral-950 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-neutral-900" />
                  <span>Tasks by Employee & Progress</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Admin monitors progress & issues warning alerts • Employees complete tasks and attach proof of work
                </p>
              </div>

              {isAdmin && (
                <PillButton
                  variant="black"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setTaskAssigneeId(projectMembers[0]?.id || profiles[2]?.id || '');
                    setShowAddTaskModal(true);
                  }}
                >
                  Assign Task
                </PillButton>
              )}
            </div>

            <div className="space-y-6">
              {projectMembers.map((member) => {
                const memberTasks = projectTasks.filter(
                  (t) => t.assignee_ids?.includes(member.id) || t.assignees?.some((a) => a.id === member.id)
                );
                const memberDone = memberTasks.filter((t) => t.status === 'completed').length;
                const completionRate =
                  memberTasks.length > 0 ? Math.round((memberDone / memberTasks.length) * 100) : 100;

                return (
                  <div
                    key={member.id}
                    className="rounded-[28px] border border-neutral-200/90 bg-[#fafbfa] p-5 sm:p-6 shadow-2xs space-y-4"
                  >
                    {/* Employee Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar_url}
                          alt={member.full_name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-neutral-950 leading-tight">
                              {member.full_name}
                            </h4>
                            <span className="text-[10px] font-bold text-neutral-600 bg-neutral-200/80 px-2.5 py-0.5 rounded-full">
                              {member.department}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500">{member.designation}</p>
                        </div>
                      </div>

                      {/* Employee Progress Meter */}
                      <div className="flex items-center gap-3.5">
                        <div className="text-right">
                          <span className="text-xs font-black text-neutral-900">
                            {memberDone} / {memberTasks.length} Completed
                          </span>
                          <div className="w-36 bg-neutral-200 h-2.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="bg-neutral-950 h-full rounded-full transition-all duration-300"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-black px-2.5 py-1 bg-white rounded-xl border border-neutral-200 text-neutral-950 shadow-2xs">
                          {completionRate}%
                        </span>
                      </div>
                    </div>

                    {/* List of Tasks Assigned to this Employee */}
                    {memberTasks.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic py-3 text-center">
                        No active tasks currently assigned to {member.full_name} for this project.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {memberTasks.map((t) => {
                          const isCompleted = t.status === 'completed';

                          return (
                            <div
                              key={t.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                isCompleted
                                  ? 'bg-neutral-50/70 border-neutral-200/60 opacity-90'
                                  : t.warning_alert
                                  ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                                  : 'bg-white border-neutral-200/90 shadow-2xs hover:border-neutral-900'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  {/* Interactive Checkbox for Employee & Admin */}
                                  <button
                                    onClick={() => toggleTaskComplete(t.id)}
                                    className="mt-0.5 text-neutral-900 hover:text-black cursor-pointer transition-transform active:scale-90"
                                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                                  >
                                    {isCompleted ? (
                                      <CheckSquare className="w-5 h-5 text-neutral-950 fill-[#d4f940]" />
                                    ) : (
                                      <Square className="w-5 h-5 text-neutral-400 hover:text-neutral-700" />
                                    )}
                                  </button>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h5
                                        className={`text-xs font-bold ${
                                          isCompleted
                                            ? 'line-through text-neutral-400 font-medium'
                                            : 'text-neutral-950'
                                        }`}
                                      >
                                        {t.title}
                                      </h5>
                                      <span
                                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                          t.priority === 'urgent'
                                            ? 'bg-red-100 text-red-700'
                                            : t.priority === 'high'
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-neutral-100 text-neutral-600'
                                        }`}
                                      >
                                        {t.priority}
                                      </span>
                                    </div>
                                    {t.description && (
                                      <p className="text-[11px] text-neutral-500 mt-1 max-w-xl leading-relaxed whitespace-pre-line">
                                        {t.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Task Controls & Badges */}
                                <div className="flex items-center gap-2 shrink-0">
                                  {/* Status Selector */}
                                  <select
                                    value={t.status}
                                    onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                                    className={`text-[11px] font-bold rounded-full px-2.5 py-1 border transition-all cursor-pointer focus:outline-none ${
                                      t.status === 'completed'
                                        ? 'bg-[#d4f940] text-neutral-950 border-[#c2e831]'
                                        : t.status === 'blocked'
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-white text-neutral-800 border-neutral-200'
                                    }`}
                                  >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="in_review">In Review</option>
                                    <option value="blocked">Blocked</option>
                                    <option value="completed">Completed ✓</option>
                                  </select>

                                  {/* Admin Warning Alert Button */}
                                  {isAdmin && (
                                    <button
                                      onClick={() => {
                                        setWarningModalTaskId(t.id);
                                        setWarningMessage(t.warning_alert || '');
                                      }}
                                      className="text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-neutral-200 hover:border-amber-400 bg-white text-neutral-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                                      title="Add or edit warning alert"
                                    >
                                      <ShieldAlert className="w-3 h-3 text-amber-600" />
                                      <span>{t.warning_alert ? 'Edit Alert' : 'Warn'}</span>
                                    </button>
                                  )}

                                  {/* Add / View Proof Button */}
                                  <button
                                    onClick={() => {
                                      setProofModalTaskId(t.id);
                                      setProofUrl(t.proof_url || '');
                                      setProofNote(t.proof_note || '');
                                    }}
                                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 cursor-pointer transition-all ${
                                      t.proof_url
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-900 shadow-2xs'
                                    }`}
                                    title="Submit Proof of Work"
                                  >
                                    <FileCheck className="w-3 h-3 text-emerald-600" />
                                    <span>{t.proof_url ? 'Proof Attached ✓' : 'Add Proof'}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Warning Alert Banner (If Alert exists) */}
                              {t.warning_alert && (
                                <div className="mt-3 p-3 bg-amber-100/90 border border-amber-300 rounded-xl flex items-start justify-between gap-3 text-xs text-amber-950 font-medium">
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="font-bold text-amber-900">Admin Warning Alert: </strong>
                                      <span>{t.warning_alert}</span>
                                    </div>
                                  </div>
                                  {isAdmin && (
                                    <button
                                      onClick={() => clearWarningAlert(t.id)}
                                      className="text-[10px] font-black uppercase text-amber-800 hover:text-red-700 underline shrink-0 cursor-pointer"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Proof Submission Details (If proof submitted) */}
                              {t.proof_url && (
                                <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-neutral-700">Proof Link:</span>
                                    <a
                                      href={t.proof_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-neutral-900 hover:underline flex items-center gap-1 truncate font-medium"
                                    >
                                      <span className="truncate">{t.proof_url}</span>
                                      <ExternalLink className="w-3 h-3 shrink-0" />
                                    </a>
                                  </div>
                                  {t.proof_note && (
                                    <span className="text-neutral-500 italic max-w-xs truncate hidden sm:inline">
                                      "{t.proof_note}"
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Inline Assign Task for this Employee (Admin Only) */}
                    {isAdmin && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setTaskAssigneeId(member.id);
                            setShowAddTaskModal(true);
                          }}
                          className="text-xs font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 cursor-pointer hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5 text-neutral-900" />
                          <span>Assign new task to {member.full_name}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT PROJECT DETAILS & SPECIFICATIONS                   */}
      {/* ============================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs select-none overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <div>
                <h3 className="text-lg font-black text-neutral-950">
                  Edit Project Specifications
                </h3>
                <p className="text-xs text-neutral-500">
                  Update project metadata, scope, features list, modules, and estimates
                </p>
              </div>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setShowEditModal(false)}
              >
                <X className="w-3.5 h-3.5" />
              </CircleButton>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-neutral-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-bold focus:outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Project Estimate (Optional)
                  </label>
                  <input
                    type="text"
                    value={editEstimate}
                    onChange={(e) => setEditEstimate(e.target.value)}
                    placeholder="e.g. 6 Weeks • $25,000 • 240 Dev Hours"
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-neutral-900 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Description / Overview
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Scope of Project
                </label>
                <textarea
                  value={editScope}
                  onChange={(e) => setEditScope(e.target.value)}
                  placeholder="Outline project boundaries, key deliverables, and out-of-scope items..."
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-900 shadow-2xs leading-relaxed"
                />
              </div>

              {/* Features List in Edit */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Project Features List
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeatureInEdit();
                      }
                    }}
                    placeholder="Type feature and click Add..."
                    className="flex-1 p-2 rounded-full border border-neutral-200 text-xs font-medium focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeatureInEdit}
                    className="px-3.5 py-2 bg-neutral-950 text-white rounded-full text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {editFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#fafbfa] rounded-2xl border border-neutral-200">
                    {editFeatures.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-white border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-full text-[11px] font-bold"
                      >
                        <span>{f}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureInEdit(f)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Modules in Edit */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Modules Breakdown
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newModuleInput}
                    onChange={(e) => setNewModuleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddModuleInEdit();
                      }
                    }}
                    placeholder="Type module name and click Add..."
                    className="flex-1 p-2 rounded-full border border-neutral-200 text-xs font-medium focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddModuleInEdit}
                    className="px-3.5 py-2 bg-neutral-950 text-white rounded-full text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {editModules.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#fafbfa] rounded-2xl border border-neutral-200">
                    {editModules.map((m, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-neutral-950 text-white px-2.5 py-1 rounded-full text-[11px] font-bold"
                      >
                        <span>{m}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveModuleInEdit(m)}
                          className="text-neutral-400 hover:text-[#d4f940]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Other Requirements & Technical Constraints
                </label>
                <textarea
                  value={editOtherRequirements}
                  onChange={(e) => setEditOtherRequirements(e.target.value)}
                  placeholder="Compliance, latency constraints, third-party integrations..."
                  rows={2}
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-900 shadow-2xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="submit"
                  variant="black"
                  size="md"
                >
                  Save Specifications
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD TASK (ADMIN ASSIGNS EXCLUSIVELY TO EMPLOYEES)        */}
      {/* ============================================================== */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-black text-neutral-950">
                Assign Task to {project.name}
              </h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setShowAddTaskModal(false)}
              >
                <X className="w-3.5 h-3.5" />
              </CircleButton>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Build Payment Webhook Listener"
                  required
                  className="w-full p-2.5 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Assign To Employee (Admin assigns to staff)
                </label>
                <select
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-bold focus:outline-none shadow-2xs"
                >
                  {profiles
                    .filter((p) => p.role === 'employee')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.designation})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Deliverables, scope, and technical acceptance criteria..."
                  rows={2}
                  className="w-full p-2.5 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2 rounded-full border border-neutral-200 text-xs font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full p-2 rounded-full border border-neutral-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setShowAddTaskModal(false)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="submit"
                  variant="black"
                  size="md"
                >
                  Assign Task
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
                Send an immediate operational warning alert to the employee assigned to this task regarding delayed progress or milestone deadlines.
              </p>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Warning Alert Message *
                </label>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="e.g. Stalled past Sprint deadline. Must push code review by 5:00 PM today."
                  rows={3}
                  required
                  className="w-full p-3 rounded-2xl border border-amber-300 bg-amber-50/50 text-xs font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
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
                Attach proof of task completion (GitHub Pull Request, Figma design link, Staging demo link, or Loom recording) for admin verification.
              </p>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Proof URL (PR link, Figma link, Staging URL) *
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/exoft/pull/42 or https://figma.com/file/..."
                  required
                  className="w-full p-2.5 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Verification Note / Test Summary (Optional)
                </label>
                <textarea
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="e.g. Unit tests pass (24/24), deployed to preview environment, cross-browser verified."
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

export default function ProjectDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f8f5] flex items-center justify-center p-8 text-xs font-bold text-neutral-400">
          Loading project workspace...
        </div>
      }
    >
      <ProjectDetailContent />
    </Suspense>
  );
}
