'use client';

import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  X,
  PlusCircle,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { PageTopHeader } from '@/components/layout/page-top-header';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { Meeting, MeetingType } from '@/types/database';
import { PillButton, CircleButton, DayPill, DateBadgePill } from '@/components/ui/button';

export default function MeetingsPage() {
  const { user } = useAuth();
  const [meetingFilter, setMeetingFilter] = useState('All');
  const [meetingSearch, setMeetingSearch] = useState('');
  const {
    meetings,
    profiles,
    createMeeting,
    updateMeetingMinutes,
    addActionItem,
    toggleActionItemStatus,
  } = useData();

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(20);

  // Minutes editing state
  const activeMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];
  const [minutesText, setMinutesText] = useState(activeMeeting?.minutes || '');
  const [decisionsText, setDecisionsText] = useState(activeMeeting?.decisions || '');
  const [blockersText, setBlockersText] = useState(activeMeeting?.blockers || '');

  // New action item state
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState(profiles[2]?.id || '');
  const [newActionDueDate, setNewActionDueDate] = useState('');

  // New meeting modal state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<MeetingType>('weekly_tuesday');
  const [newStartTime, setNewStartTime] = useState('');
  const [newAgenda, setNewAgenda] = useState('');

  const handleSaveMinutes = () => {
    if (!activeMeeting) return;
    updateMeetingMinutes(activeMeeting.id, minutesText, decisionsText, blockersText);
    alert('Meeting minutes, decisions, and blockers saved.');
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle || !activeMeeting) return;

    addActionItem(
      activeMeeting.id,
      newActionTitle,
      newActionAssignee,
      newActionDueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
    );

    setNewActionTitle('');
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    createMeeting({
      title: newTitle,
      description: newDescription,
      meeting_type: newType,
      recurrence: newType === 'weekly_tuesday' ? 'weekly_tuesday' : 'none',
      start_time: newStartTime || new Date().toISOString(),
      agenda: newAgenda,
      participant_ids: profiles.map((p) => p.id),
    });

    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);
  };

  return (
    <WorkspaceShell
      title="Company Meetings & Tuesday Reviews"
      description="Collaborate, address blockers, record decisions, and enforce weekly action items"
    >
      {/* ============================================================== */}
      {/* PAGE TOP HEADER (MATCHING REFERENCE WORKSPACE DETAILS)         */}
      {/* ============================================================== */}
      <PageTopHeader
        title="MEETINGS"
        actionButton={
          <PillButton
            variant="black"
            size="md"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowCreateModal(true)}
          >
            Schedule Sync
          </PillButton>
        }
        metrics={[
          { value: meetings.length, label: 'Calls', trend: 'Today', trendType: 'lime' },
          { value: 1, label: 'Live Now', trend: 'Tuesday Sync', trendType: 'orange' },
          { value: profiles.length, label: 'Attendees', trend: 'All Hands', trendType: 'positive' },
        ]}
        categoryLabel="Weekly Cadence"
        categoryCount={`${meetings.length} Scheduled`}
        filters={['All', '🔥 Tuesday Sync', 'Friday Review', 'Client Review', 'Standups']}
        activeFilter={meetingFilter}
        onFilterChange={setMeetingFilter}
        searchValue={meetingSearch}
        onSearchChange={setMeetingSearch}
        searchPlaceholder="Search meeting agendas..."
      />

      {/* Tuesday Workflow Guidance Banner with Lime Accent */}
      <div className="bg-neutral-950 text-white p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#d4f940] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#d4f940] animate-pulse" />
            Exoft Weekly Cadence
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Tuesday Progress Review & Blocker Resolution</h2>
          <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed font-medium">
            Monday: Task planning • <strong className="text-[#d4f940]">Tuesday: Progress review & blocker discussion</strong> • Wednesday & Thursday: Execution • Friday: Weekly report review.
          </p>

          {/* Quick Calendar Day Pills in Header Banner */}
          <div className="flex items-center gap-2 mt-4 sm:mt-5 overflow-x-auto scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0 py-1 touch-scroll">
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
                isActive={selectedCalendarDay === item.day}
                onClick={() => setSelectedCalendarDay(item.day)}
                className="shrink-0"
              />
            ))}
          </div>
        </div>

        <PillButton
          variant="lime"
          size="md"
          className="w-full md:w-auto"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          Schedule Meeting
        </PillButton>
      </div>

      {/* Main Grid: Meeting List & Live Meeting Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Meeting List */}
        <div className="space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 px-1">
            Scheduled Sessions ({meetings.length})
          </div>

          {meetings.map((m) => {
            const isSelected = m.id === selectedMeetingId;
            const isTuesday = m.meeting_type === 'weekly_tuesday';

            return (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMeetingId(m.id);
                  setMinutesText(m.minutes || '');
                  setDecisionsText(m.decisions || '');
                  setBlockersText(m.blockers || '');
                }}
                className={`p-5 rounded-[28px] border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-950 bg-white shadow-md ring-1 ring-neutral-950'
                    : 'border-neutral-200/80 bg-white hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      isTuesday ? 'bg-[#d4f940] text-neutral-950' : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {isTuesday ? 'Weekly Tuesday Sync' : m.meeting_type}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-semibold">
                    {new Date(m.start_time).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-neutral-950">{m.title}</h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{m.description}</p>

                <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-neutral-100 text-xs text-neutral-400 font-medium">
                  <span className="flex items-center gap-1.5 text-neutral-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    {m.action_items?.length || 0} Action Items
                  </span>
                  <CircleButton variant="white" size="sm">
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-800" />
                  </CircleButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Meeting Workspace Console (2 Cols) */}
        {activeMeeting && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header info */}
            <div className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d4f940] text-neutral-950">
                    {activeMeeting.meeting_type === 'weekly_tuesday' ? 'Recurring Tuesday Review' : 'Special Session'}
                  </span>
                  <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight mt-3">{activeMeeting.title}</h2>
                  <p className="text-xs text-neutral-500 mt-1">{activeMeeting.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <DateBadgePill day="20" weekday="Tue" month="10:00 AM" />
                </div>
              </div>

              {/* Agenda Box */}
              <div className="mt-5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-1.5">
                  Agenda & Focus
                </div>
                <div className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed font-medium">
                  {activeMeeting.agenda || 'No formal agenda provided.'}
                </div>
              </div>

              {/* Participants */}
              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700">Team Participants ({profiles.length})</span>
                <div className="flex -space-x-1.5">
                  {profiles.map((p) => (
                    <img
                      key={p.id}
                      src={p.avatar_url}
                      alt={p.full_name}
                      title={p.full_name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Items Tracker */}
            <div className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-extrabold text-neutral-950">Tuesday Action Items</h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-800">
                  {activeMeeting.action_items?.length || 0} tracked
                </span>
              </div>

              {/* Action Item list */}
              <div className="space-y-2.5 mb-5">
                {activeMeeting.action_items?.map((item) => {
                  const assignee = profiles.find((p) => p.id === item.assignee_id);
                  const isDone = item.status === 'completed';

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                        isDone
                          ? 'bg-neutral-50/60 border-neutral-200 opacity-70'
                          : 'bg-white border-neutral-200 hover:border-neutral-950 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleActionItemStatus(activeMeeting.id, item.id)}
                          className="w-4 h-4 rounded-full text-neutral-950 focus:ring-neutral-950 cursor-pointer accent-neutral-950"
                        />
                        <div className="min-w-0">
                          <span
                            className={`text-xs font-bold block truncate ${
                              isDone ? 'line-through text-neutral-400' : 'text-neutral-950'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium">Due: {item.due_date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {assignee && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-bold bg-neutral-100 px-2.5 py-1 rounded-full">
                            <img
                              src={assignee.avatar_url}
                              alt=""
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{assignee.full_name.split(' ')[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Action Item Form using Pill Buttons */}
              <form onSubmit={handleAddAction} className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  placeholder="New action item title..."
                  className="flex-1 px-4 py-2.5 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                />

                <select
                  value={newActionAssignee}
                  onChange={(e) => setNewActionAssignee(e.target.value)}
                  className="px-4 py-2.5 rounded-full border border-neutral-200 text-xs font-bold text-neutral-800 focus:outline-none"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={newActionDueDate}
                  onChange={(e) => setNewActionDueDate(e.target.value)}
                  className="px-3 py-2.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700"
                />

                <PillButton type="submit" variant="black" size="md">
                  Add Item
                </PillButton>
              </form>
            </div>

            {/* Minutes, Decisions & Blockers Recorder */}
            <div className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-neutral-950">Meeting Minutes & Blockers</h3>
                <PillButton
                  type="button"
                  variant="black"
                  size="sm"
                  onClick={handleSaveMinutes}
                >
                  Save Updates
                </PillButton>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Discussion Minutes
                </label>
                <textarea
                  value={minutesText}
                  onChange={(e) => setMinutesText(e.target.value)}
                  rows={3}
                  placeholder="Record summary of team progress discussed..."
                  className="w-full p-3.5 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Key Decisions
                  </label>
                  <textarea
                    value={decisionsText}
                    onChange={(e) => setDecisionsText(e.target.value)}
                    rows={2}
                    placeholder="Decisions approved during review..."
                    className="w-full p-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-red-600 mb-1">
                    Active Blockers Raised
                  </label>
                  <textarea
                    value={blockersText}
                    onChange={(e) => setBlockersText(e.target.value)}
                    rows={2}
                    placeholder="Blockers requiring management resolution..."
                    className="w-full p-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Schedule Meeting */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-neutral-200 max-h-[88vh] overflow-y-auto touch-scroll">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-extrabold text-neutral-950">Schedule Team Session</h3>
              <CircleButton
                variant="white"
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-4 h-4" />
              </CircleButton>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Weekly Tuesday Progress Review"
                  required
                  className="w-full p-3 rounded-full border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Meeting Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MeetingType)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-bold"
                  >
                    <option value="weekly_tuesday">Weekly Tuesday Review</option>
                    <option value="planning">Project Planning</option>
                    <option value="client_review">Client Review</option>
                    <option value="standup">Standup</option>
                    <option value="adhoc">Ad-hoc Sync</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-full border border-neutral-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Agenda
                </label>
                <textarea
                  value={newAgenda}
                  onChange={(e) => setNewAgenda(e.target.value)}
                  placeholder="1. Review deliverables\n2. Discuss blockers..."
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                />
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
                  Schedule
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
