'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Check,
  Calendar,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  FileText,
  DollarSign,
  Clock,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { PriorityLevel } from '@/types/database';
import { PillButton } from '@/components/ui/button';

function CreateProjectContent() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { profiles, clients, createProject } = useData();

  // Basic Information
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [deadline, setDeadline] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([
    profiles[0]?.id || '',
    profiles[2]?.id || '',
  ].filter(Boolean));

  // Project Scope & Specifications (Optional - can be edited later)
  const [scope, setScope] = useState('');

  // Features List
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  // Modules List
  const [modules, setModules] = useState<string[]>([]);
  const [moduleInput, setModuleInput] = useState('');

  // Other Requirements
  const [otherRequirements, setOtherRequirements] = useState('');

  // Estimate
  const [estimate, setEstimate] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick suggestions for features
  const suggestedFeatures = [
    'User Authentication & Role-Based Access Control',
    'Real-time Dashboard Analytics & Activity Feed',
    'Secure Stripe Checkout Drawer & Invoicing',
    'Push & In-App Notification Alerts',
    'CSV & PDF Export for Reports',
  ];

  // Quick suggestions for modules
  const suggestedModules = [
    'Authentication & Security',
    'Customer Facing Dashboard',
    'Admin Portal & Settings',
    'Billing & Subscriptions',
    'API & Webhook Engine',
  ];

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (!features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
    }
    setFeatureInput('');
  };

  const handleRemoveFeature = (feat: string) => {
    setFeatures(features.filter((f) => f !== feat));
  };

  const handleAddModule = () => {
    const trimmed = moduleInput.trim();
    if (!trimmed) return;
    if (!modules.includes(trimmed)) {
      setModules([...modules, trimmed]);
    }
    setModuleInput('');
  };

  const handleRemoveModule = (mod: string) => {
    setModules(modules.filter((m) => m !== mod));
  };

  const toggleMember = (memberId: string) => {
    if (selectedMemberIds.includes(memberId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== memberId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, memberId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const newProject = createProject({
      name: name.trim(),
      description: description.trim(),
      client_name: clientName.trim() || 'Internal (Exoft)',
      priority,
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      member_ids: selectedMemberIds,
      status: 'active',
      progress: 0,
      scope: scope.trim(),
      features,
      modules,
      other_requirements: otherRequirements.trim(),
      estimate: estimate.trim(),
    });

    router.push(`/projects/${newProject.id}`);
  };

  return (
    <WorkspaceShell
      title="Create New Project"
      description="Define core project parameters, scope, features, modules, and estimates. Specifications are optional and can be modified later."
    >
      <PageTopHeader
        title="NEW PROJECT"
        actionButton={
          <Link href="/projects">
            <PillButton variant="white" size="md" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Projects
            </PillButton>
          </Link>
        }
        categoryLabel="Project Initiation"
        categoryCount="Streamlined Intake"
        filters={['Overview', 'Specifications']}
        activeFilter="Overview"
      />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12 select-none">
        {/* ============================================================== */}
        {/* CARD 1: ESSENTIAL PROJECT DETAILS                              */}
        {/* ============================================================== */}
        <div className="bg-white border border-neutral-200/90 rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-black text-neutral-950 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-neutral-900" />
                <span>Essential Project Details</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Primary metadata, client assignment, and delivery target
              </p>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
              Required Info
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Omnipay Mobile Wallet or Corporate Portal Redesign"
                required
                className="w-full p-3 rounded-2xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Client / Organization
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Nexus Retail Inc. or Internal (Exoft)"
                list="client-suggestions"
                className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-2xs"
              />
              <datalist id="client-suggestions">
                {clients?.map((c) => (
                  <option key={c.id} value={c.company_name} />
                ))}
                <option value="Internal (Exoft)" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-bold focus:outline-none focus:border-neutral-950 shadow-2xs"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority 🔥</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Brief Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="One sentence summary of what this project aims to accomplish..."
                className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-2xs"
              />
            </div>
          </div>

          {/* Team Member Allocation */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-2">
              Team Member Allocation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {profiles.map((profile) => {
                const isSelected = selectedMemberIds.includes(profile.id);
                return (
                  <div
                    key={profile.id}
                    onClick={() => toggleMember(profile.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-[#fafbfa] border-neutral-200/80 text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold truncate">{profile.full_name}</p>
                      <p className={`text-[10px] truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {profile.designation}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#d4f940] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 2: SCOPE OF PROJECT (OPTIONAL - EDITABLE LATER)          */}
        {/* ============================================================== */}
        <div className="bg-white border border-neutral-200/90 rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-black text-neutral-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-neutral-900" />
                <span>Scope of Project</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Optional overview of project boundaries and key deliverables (can be edited later)
              </p>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
              Optional
            </span>
          </div>

          <div>
            <textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. End-to-end design and engineering of responsive client web portal, customer checkout flows, and automated inventory sync with legacy databases. Third-party logistics integration is scheduled for Phase 2."
              rows={4}
              className="w-full p-4 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 3: PROJECT FEATURES LIST (OPTIONAL - EDITABLE LATER)      */}
        {/* ============================================================== */}
        <div className="bg-white border border-neutral-200/90 rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-black text-neutral-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neutral-900" />
                <span>Project Features List</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Key user-facing features or capabilities (can be edited later)
              </p>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
              Optional
            </span>
          </div>

          {/* Feature Adder */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
              placeholder="Type a feature and press Enter or click Add..."
              className="flex-1 p-3 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-2xs"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-bold text-neutral-400 mr-1">Quick Add:</span>
            {suggestedFeatures.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!features.includes(sug)) setFeatures([...features, sug]);
                }}
                className="text-[10px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-full transition-all cursor-pointer"
              >
                + {sug}
              </button>
            ))}
          </div>

          {/* Selected Features Chips */}
          {features.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-neutral-900">
                Added Features ({features.length}):
              </span>
              <div className="space-y-2">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#fafbfa] border border-neutral-200/90 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold text-neutral-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{feat}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feat)}
                      className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Remove feature"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* CARD 4: MODULES BREAKDOWN (OPTIONAL - EDITABLE LATER)          */}
        {/* ============================================================== */}
        <div className="bg-white border border-neutral-200/90 rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-black text-neutral-950 flex items-center gap-2">
                <Layers className="w-5 h-5 text-neutral-900" />
                <span>Modules Breakdown</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Subsystems and architectural modules (can be edited later)
              </p>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
              Optional
            </span>
          </div>

          {/* Module Adder */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={moduleInput}
              onChange={(e) => setModuleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddModule();
                }
              }}
              placeholder="e.g. Authentication, Billing, Dashboard, Public Storefront..."
              className="flex-1 p-3 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-2xs"
            />
            <button
              type="button"
              onClick={handleAddModule}
              className="px-4 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-bold text-neutral-400 mr-1">Quick Add:</span>
            {suggestedModules.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!modules.includes(sug)) setModules([...modules, sug]);
                }}
                className="text-[10px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-full transition-all cursor-pointer"
              >
                + {sug}
              </button>
            ))}
          </div>

          {/* Selected Modules Chips */}
          {modules.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-neutral-900">
                Added Modules ({modules.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {modules.map((mod, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-neutral-950 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs"
                  >
                    <span>{mod}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(mod)}
                      className="text-neutral-400 hover:text-[#d4f940] transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* CARD 5: OTHER REQUIREMENTS (OPTIONAL - EDITABLE LATER)         */}
        {/* ============================================================== */}
        <div className="bg-white border border-neutral-200/90 rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-black text-neutral-950 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-neutral-900" />
                <span>Other Requirements</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Technical constraints, performance criteria, or compliance needs (can be edited later)
              </p>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
              Optional
            </span>
          </div>

          <div>
            <textarea
              value={otherRequirements}
              onChange={(e) => setOtherRequirements(e.target.value)}
              placeholder="e.g. Sub-200ms API response latency, GDPR compliance, multi-currency support (USD, EUR, GBP), and automated daily backup routines."
              rows={3}
              className="w-full p-4 rounded-2xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD 6: ESTIMATE (OPTIONAL - EDITABLE LATER)                   */}
        {/* ============================================================== */}
        <div className="bg-white border border-neutral-200/90 rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-black text-neutral-950 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-neutral-900" />
                <span>Project Estimate</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Estimated budget, duration, or engineering hours (can be edited later)
              </p>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
              Optional
            </span>
          </div>

          <div>
            <input
              type="text"
              value={estimate}
              onChange={(e) => setEstimate(e.target.value)}
              placeholder="e.g. 6 Weeks • $25,000 • 240 Dev Hours"
              className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM ACTION BUTTONS                                          */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/projects">
            <PillButton type="button" variant="white" size="lg">
              Cancel
            </PillButton>
          </Link>

          <PillButton
            type="submit"
            variant="black"
            size="lg"
            disabled={!name.trim() || isSubmitting}
            icon={<CheckCircle2 className="w-4 h-4 text-[#d4f940]" />}
          >
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </PillButton>
        </div>
      </form>
    </WorkspaceShell>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f8f5] flex items-center justify-center p-8 text-xs font-bold text-neutral-400">
          Loading project creator...
        </div>
      }
    >
      <CreateProjectContent />
    </Suspense>
  );
}
