'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Shield,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  MoreVertical,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { Profile, UserRole } from '@/types/database';
import { PillButton, CircleButton } from '@/components/ui/button';

export default function TeamPage() {
  const { user, isAdmin } = useAuth();
  const { profiles, tasks, addTeamMember, updateTeamMember } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Member Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('employee');
  const [newDesignation, setNewDesignation] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filteredMembers = profiles.filter((p) => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.designation.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesRole = true;
    if (roleFilter === 'Admins') matchesRole = p.role === 'admin';
    else if (roleFilter === 'Employees') matchesRole = p.role === 'employee';
    else if (roleFilter === 'Engineering') matchesRole = p.department === 'Engineering' || p.department === 'Quality Assurance';
    else if (roleFilter === 'Product') matchesRole = p.department === 'Design' || p.department === 'Executive';

    return matchesSearch && matchesRole;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addTeamMember({
      full_name: newName,
      email: newEmail,
      role: newRole,
      designation: newDesignation || 'Software Engineer',
      department: newDepartment || 'Engineering',
      phone: newPhone,
    });

    setNewName('');
    setNewEmail('');
    setNewDesignation('');
    setShowAddModal(false);
  };

  return (
    <WorkspaceShell
      title="Company Team & Roles"
      description="Manage the 7 Exoft Technologies team members, workloads, roles, and designations"
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER (MATCHING REFERENCE WORKSPACE DETAILS)         */}
      {/* ============================================================== */}
      <PageTopHeader
        title="TEAM"
        actionButton={
          isAdmin && (
            <PillButton
              variant="black"
              size="md"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowAddModal(true)}
            >
              Add Member
            </PillButton>
          )
        }
        metrics={[
          { value: profiles.length, label: 'Members', trend: '100% active', trendType: 'lime' },
          { value: profiles.filter(p => p.role === 'admin').length, label: 'Admins', trend: 'Owners', trendType: 'orange' },
          { value: profiles.filter(p => p.role === 'employee').length, label: 'Staff', trend: 'Engineers', trendType: 'positive' },
        ]}
        categoryLabel="Team Directory"
        categoryCount={`${filteredMembers.length} Members`}
        filters={['All', 'Admins', 'Employees', 'Engineering', 'Product']}
        activeFilter={roleFilter}
        onFilterChange={setRoleFilter}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search team members by name or role..."
      />

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const assignedTasks = tasks.filter((t) => t.assignee_ids?.includes(member.id));
          const completedTasks = assignedTasks.filter((t) => t.status === 'completed');
          const isOwner = member.role === 'admin';

          return (
            <div
              key={member.id}
              className="bg-white p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] border border-neutral-200/80 shadow-xs hover:border-neutral-950 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={member.full_name}
                      className="w-13 h-13 rounded-full object-cover ring-2 ring-neutral-100 shadow-xs"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-neutral-950">{member.full_name}</h3>
                      <p className="text-xs text-neutral-500 font-medium">{member.designation}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      isOwner
                        ? 'bg-neutral-950 text-white'
                        : 'bg-[#d4f940] text-neutral-950'
                    }`}
                  >
                    {isOwner ? <Shield className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                    {isOwner ? 'Admin' : 'Employee'}
                  </span>
                </div>

                {/* Contact & Department */}
                <div className="space-y-2 text-xs text-neutral-600 py-3.5 border-y border-neutral-100 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-neutral-400 pt-1 font-semibold">
                    Department: <strong className="text-neutral-800">{member.department}</strong>
                  </div>
                </div>

                {/* Workload Capsule Progress */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-500">Assigned Tasks</span>
                    <span className="text-neutral-950">
                      {completedTasks.length} / {assignedTasks.length} Done
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden p-0.5">
                    <div
                      className="bg-[#d4f940] h-full rounded-full transition-all"
                      style={{
                        width: `${
                          assignedTasks.length > 0
                            ? Math.round((completedTasks.length / assignedTasks.length) * 100)
                            : 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status footer with Pill Toggle */}
              <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-900 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#d4f940]" />
                  Active Account
                </span>

                {isAdmin && (
                  <PillButton
                    variant="white"
                    size="sm"
                    onClick={() => {
                      const newRolePrompt = member.role === 'admin' ? 'employee' : 'admin';
                      if (confirm(`Change ${member.full_name}'s role to ${newRolePrompt}?`)) {
                        updateTeamMember(member.id, { role: newRolePrompt });
                      }
                    }}
                  >
                    Toggle Role
                  </PillButton>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Team Member */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-neutral-200 max-h-[88vh] overflow-y-auto touch-scroll">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-extrabold text-neutral-950">Add Team Member</h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-4 h-4" />
              </CircleButton>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  required
                  className="w-full p-3 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jordan@exoft.tech"
                  required
                  className="w-full p-3 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-bold"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    placeholder="e.g. React Engineer"
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <PillButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </PillButton>
                <PillButton
                  type="submit"
                  variant="black"
                  size="md"
                >
                  Save Member
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
