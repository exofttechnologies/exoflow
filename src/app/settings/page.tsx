'use client';

import React from 'react';
import {
  Settings,
  Shield,
  Database,
  Building,
  Lock,
  CheckCircle2,
  AlertCircle,
  Key,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { useAuth } from '@/context/auth-context';

export default function SettingsPage() {
  const { user, isAdmin, isSupabaseConnected } = useAuth();

  return (
    <WorkspaceShell
      title="Company & Workspace Settings"
      description="Configure Exoft Technologies preferences, security permissions, and database credentials"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Company Profile Card */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100">
            <Building className="w-5 h-5 text-neutral-800" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Organization Profile</h3>
              <p className="text-xs text-neutral-400">Company identity and branding guidelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-neutral-500 font-medium block mb-1">Company Name</label>
              <div className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 font-semibold">
                Exoft Technologies
              </div>
            </div>

            <div>
              <label className="text-neutral-500 font-medium block mb-1">Product Platform</label>
              <div className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 font-semibold">
                Exoft Flow
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-neutral-500 font-medium block mb-1">Company Tagline</label>
              <div className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900">
                Work together. Move forward.
              </div>
            </div>
          </div>
        </div>

        {/* Database & Supabase Integration Status */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Supabase Database Integration</h3>
                <p className="text-xs text-neutral-400">PostgreSQL backend and authentication status</p>
              </div>
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto ${
                isSupabaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-teal-50 text-teal-800 border border-teal-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              {isSupabaseConnected ? 'Connected to Supabase' : 'Offline / Standalone Storage Mode'}
            </span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            Exoft Flow includes full production SQL migrations (with 14 tables and Row Level Security policies) and an idempotent seed script ready in <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800">supabase/migrations/</code>.
          </p>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2 overflow-x-auto">
            <div className="font-bold text-neutral-800 flex items-center gap-2">
              <Key className="w-3.5 h-3.5" />
              <span>Environment Configuration:</span>
            </div>
            <div className="font-mono text-[11px] text-neutral-600 space-y-1">
              <div>NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
              <div>SUPABASE_SERVICE_ROLE_KEY=your-service-key (server only)</div>
            </div>
          </div>
        </div>

        {/* Role & Security Matrix */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100">
            <Shield className="w-5 h-5 text-neutral-800" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Role Permissions & RLS Policies</h3>
              <p className="text-xs text-neutral-400">Enforced by database policies and server checks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900">
                <Shield className="w-3.5 h-3.5 text-neutral-800" />
                <span>Admin Capabilities</span>
              </div>
              <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                <li>Manage all company projects, tasks, & deadlines</li>
                <li>Add, edit, and deactivate team accounts</li>
                <li>Review weekly progress reports and issue feedback</li>
                <li>Manage meeting agendas, minutes, and action items</li>
                <li>Access executive performance & workload analytics</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Employee Capabilities</span>
              </div>
              <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                <li>Update progress & status on assigned tasks</li>
                <li>Report blockers for management resolution</li>
                <li>Draft, save, and submit Friday weekly reports</li>
                <li>Schedule meetings and record collaborative notes</li>
                <li>Protected from unauthorized role elevation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
