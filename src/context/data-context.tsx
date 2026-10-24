'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  Task,
  Meeting,
  WeeklyReport,
  Notification,
  ActivityLog,
  Profile,
  TaskStatus,
  ReportStatus,
  Announcement,
  Client,
  ProjectInitiationDraft,
  ProjectStage,
  ProjectDocument,
  SRSDocument,
} from '@/types/database';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MEETINGS,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_PROFILES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CLIENTS,
  INITIAL_PROJECT_DRAFTS,
} from '@/lib/mock-data';
import { useAuth } from './auth-context';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  reports: WeeklyReport[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  profiles: Profile[];
  announcements: Announcement[];
  clients: Client[];
  projectDrafts: ProjectInitiationDraft[];

  // Announcement actions
  createAnnouncement: (announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Client actions
  createClient: (client: Partial<Client>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;

  // Project Initiation & SOP actions
  saveProjectDraft: (draft: Partial<ProjectInitiationDraft>) => string;
  getProjectDraft: (id: string) => ProjectInitiationDraft | undefined;
  deleteProjectDraft: (id: string) => void;
  approveProjectInitiation: (draftId: string, comments: string, approverId: string) => void;
  kickoffProject: (draftId: string, kickoffMeetingDate?: string) => { project: Project; generatedTasksCount: number };



  // Task actions
  createTask: (task: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, progress?: number, blockerDesc?: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addWarningAlert: (taskId: string, alertText: string) => void;
  clearWarningAlert: (taskId: string) => void;
  submitTaskProof: (taskId: string, proofUrl: string, proofNote?: string) => void;
  toggleTaskComplete: (taskId: string) => void;

  // Project actions
  createProject: (project: Partial<Project>) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;

  // Meeting actions
  createMeeting: (meeting: Partial<Meeting>) => void;
  updateMeetingMinutes: (meetingId: string, minutes: string, decisions?: string, blockers?: string) => void;
  addActionItem: (meetingId: string, title: string, assigneeId: string, dueDate: string) => void;
  toggleActionItemStatus: (meetingId: string, actionItemId: string) => void;

  // Report actions
  submitWeeklyReport: (report: Partial<WeeklyReport>) => void;
  reviewWeeklyReport: (reportId: string, status: ReportStatus, feedback: string) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Team actions
  addTeamMember: (member: Partial<Profile>) => void;
  updateTeamMember: (id: string, updates: Partial<Profile>) => void;

  // Helpers
  getProfileById: (id: string) => Profile | undefined;
  getProjectById: (id: string) => Project | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'exoflow_data_projects',
  TASKS: 'exoflow_data_tasks',
  MEETINGS: 'exoflow_data_meetings',
  REPORTS: 'exoflow_data_reports',
  NOTIFICATIONS: 'exoflow_data_notifications',
  ACTIVITIES: 'exoflow_data_activities',
  PROFILES: 'exoflow_data_profiles',
  ANNOUNCEMENTS: 'exoflow_data_announcements',
  CLIENTS: 'exoflow_data_clients',
  PROJECT_DRAFTS: 'exoflow_data_project_drafts',
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [reports, setReports] = useState<WeeklyReport[]>(INITIAL_REPORTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [projectDrafts, setProjectDrafts] = useState<ProjectInitiationDraft[]>(INITIAL_PROJECT_DRAFTS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedMeetings = localStorage.getItem(STORAGE_KEYS.MEETINGS);
      if (savedMeetings) setMeetings(JSON.parse(savedMeetings));

      const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (savedReports) setReports(JSON.parse(savedReports));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (savedActivities) setActivityLogs(JSON.parse(savedActivities));

      const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (savedProfiles) setProfiles(JSON.parse(savedProfiles));

      const savedAnnouncements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));

      const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (savedClients) setClients(JSON.parse(savedClients));

      const savedDrafts = localStorage.getItem(STORAGE_KEYS.PROJECT_DRAFTS);
      if (savedDrafts) setProjectDrafts(JSON.parse(savedDrafts));
    } catch (e) {
      console.warn('Failed to parse saved Exoft Flow state, using defaults', e);
    }
  }, []);



  const saveState = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const getProfileById = (id: string) => profiles.find((p) => p.id === id);
  const getProjectById = (id: string) => projects.find((p) => p.id === id);

  const logActivity = (entityType: any, entityId: string, action: string, details?: any) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      actor_id: user?.id || profiles[0].id,
      entity_type: entityType,
      entity_id: entityId,
      action,
      details,
      created_at: new Date().toISOString(),
    };
    const updated = [newLog, ...activityLogs];
    setActivityLogs(updated);
    saveState(STORAGE_KEYS.ACTIVITIES, updated);
  };

  // Task actions
  const createTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      project_id: taskData.project_id || projects[0].id,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      created_by: user?.id || profiles[0].id,
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      progress: taskData.progress || 0,
      start_date: taskData.start_date || new Date().toISOString().split('T')[0],
      due_date: taskData.due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignees: [],
      assignee_ids: taskData.assignee_ids || [user?.id || profiles[2].id],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveState(STORAGE_KEYS.TASKS, updated);
    logActivity('task', newTask.id, 'created_task', { title: newTask.title });

    // Notify assignees
    newTask.assignee_ids?.forEach((assigneeId) => {
      const newNotif: Notification = {
        id: `notif-${Date.now()}-${assigneeId}`,
        user_id: assigneeId,
        title: 'New Task Assigned',
        message: `${user?.full_name || 'Admin'} assigned you to "${newTask.title}"`,
        type: 'task_assigned',
        link: '/tasks',
        is_read: false,
        created_at: new Date().toISOString(),
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveState(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
    });
  };

  const updateTaskStatus = (
    taskId: string,
    status: TaskStatus,
    progress?: number,
    blockerDesc?: string
  ) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const autoProgress =
          progress !== undefined
            ? progress
            : status === 'completed'
            ? 100
            : status === 'in_progress' && t.progress === 0
            ? 25
            : t.progress;

        return {
          ...t,
          status,
          progress: autoProgress,
          blocker_description: blockerDesc !== undefined ? blockerDesc : t.blocker_description,
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    });

    setTasks(updated);
    saveState(STORAGE_KEYS.TASKS, updated);
    logActivity('task', taskId, 'updated_task_status', { status, progress });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
    );
    setTasks(updated);
    saveState(STORAGE_KEYS.TASKS, updated);
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveState(STORAGE_KEYS.TASKS, updated);
    logActivity('task', taskId, 'deleted_task');
  };

  const addWarningAlert = (taskId: string, alertText: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            warning_alert: alertText,
            updated_at: new Date().toISOString(),
          }
        : t
    );
    setTasks(updated);
    saveState(STORAGE_KEYS.TASKS, updated);
    logActivity('task', taskId, 'added_warning_alert', { alert: alertText });

    const targetTask = tasks.find((t) => t.id === taskId);
    targetTask?.assignee_ids?.forEach((assigneeId) => {
      const newNotif: Notification = {
        id: `notif-warn-${Date.now()}-${assigneeId}`,
        user_id: assigneeId,
        title: '⚠️ Task Warning Alert',
        message: `Admin flagged: "${alertText}" on task "${targetTask.title}"`,
        type: 'warning',
        link: '/my-tasks',
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => {
        const next = [newNotif, ...prev];
        saveState(STORAGE_KEYS.NOTIFICATIONS, next);
        return next;
      });
    });
  };

  const clearWarningAlert = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            warning_alert: undefined,
            updated_at: new Date().toISOString(),
          }
        : t
    );
    setTasks(updated);
    saveState(STORAGE_KEYS.TASKS, updated);
  };

  const submitTaskProof = (taskId: string, proofUrl: string, proofNote?: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            proof_url: proofUrl,
            proof_note: proofNote,
            proof_submitted_at: new Date().toISOString(),
            status: 'completed' as TaskStatus,
            progress: 100,
            updated_at: new Date().toISOString(),
          }
        : t
    );
    setTasks(updated);
    saveState(STORAGE_KEYS.TASKS, updated);
    logActivity('task', taskId, 'submitted_proof', { proofUrl, proofNote });

    const targetTask = tasks.find((t) => t.id === taskId);
    const adminProfiles = profiles.filter((p) => p.role === 'admin');
    adminProfiles.forEach((admin) => {
      const newNotif: Notification = {
        id: `notif-proof-${Date.now()}-${admin.id}`,
        user_id: admin.id,
        title: 'Proof Submitted ✓',
        message: `${user?.full_name || 'Employee'} submitted completion proof for "${targetTask?.title || 'task'}"`,
        type: 'proof_submitted',
        link: '/tasks',
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => {
        const next = [newNotif, ...prev];
        saveState(STORAGE_KEYS.NOTIFICATIONS, next);
        return next;
      });
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const isCompleted = target.status === 'completed';
    updateTaskStatus(taskId, isCompleted ? 'in_progress' : 'completed', isCompleted ? 50 : 100);
  };

  // Project actions
  const createProject = (projectData: Partial<Project>): Project => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectData.name || 'Untitled Project',
      description: projectData.description || '',
      client_name: projectData.client_name || 'Internal',
      project_manager_id: projectData.project_manager_id || user?.id || profiles[0].id,
      start_date: projectData.start_date || new Date().toISOString().split('T')[0],
      deadline: projectData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      priority: projectData.priority || 'medium',
      status: projectData.status || 'active',
      progress: projectData.progress || 0,
      created_by: user?.id || profiles[0].id,
      created_at: new Date().toISOString(),
      member_ids: projectData.member_ids || [profiles[0].id, profiles[2].id],
      scope: projectData.scope || '',
      features: projectData.features || [],
      modules: projectData.modules || [],
      other_requirements: projectData.other_requirements || '',
      estimate: projectData.estimate || '',
      ...projectData,
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    saveState(STORAGE_KEYS.PROJECTS, updated);
    logActivity('project', newProject.id, 'created_project', { name: newProject.name });
    return newProject;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    setProjects(updated);
    saveState(STORAGE_KEYS.PROJECTS, updated);
  };

  // Meeting actions
  const createMeeting = (meetingData: Partial<Meeting>) => {
    const newMeeting: Meeting = {
      id: `meet-${Date.now()}`,
      title: meetingData.title || 'Team Meeting',
      description: meetingData.description || '',
      start_time: meetingData.start_time || new Date().toISOString(),
      end_time: meetingData.end_time || new Date(Date.now() + 3600000).toISOString(),
      creator_id: user?.id || profiles[0].id,
      project_id: meetingData.project_id,
      agenda: meetingData.agenda || '',
      meeting_type: meetingData.meeting_type || 'standup',
      recurrence: meetingData.recurrence || 'none',
      status: 'scheduled',
      participants: [],
      participant_ids: meetingData.participant_ids || profiles.map((p) => p.id),
      action_items: [],
      created_at: new Date().toISOString(),
    };

    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    saveState(STORAGE_KEYS.MEETINGS, updated);
    logActivity('meeting', newMeeting.id, 'scheduled_meeting', { title: newMeeting.title });
  };

  const updateMeetingMinutes = (
    meetingId: string,
    minutes: string,
    decisions?: string,
    blockers?: string
  ) => {
    const updated = meetings.map((m) =>
      m.id === meetingId
        ? {
            ...m,
            minutes,
            decisions: decisions ?? m.decisions,
            blockers: blockers ?? m.blockers,
            updated_at: new Date().toISOString(),
          }
        : m
    );
    setMeetings(updated);
    saveState(STORAGE_KEYS.MEETINGS, updated);
  };

  const addActionItem = (
    meetingId: string,
    title: string,
    assigneeId: string,
    dueDate: string
  ) => {
    const updated = meetings.map((m) => {
      if (m.id === meetingId) {
        const newItem = {
          id: `item-${Date.now()}`,
          meeting_id: meetingId,
          assignee_id: assigneeId,
          title,
          due_date: dueDate,
          status: 'pending' as const,
          created_at: new Date().toISOString(),
        };
        return {
          ...m,
          action_items: [...(m.action_items || []), newItem],
        };
      }
      return m;
    });
    setMeetings(updated);
    saveState(STORAGE_KEYS.MEETINGS, updated);
  };

  const toggleActionItemStatus = (meetingId: string, actionItemId: string) => {
    const updated = meetings.map((m) => {
      if (m.id === meetingId && m.action_items) {
        return {
          ...m,
          action_items: m.action_items.map((item) =>
            item.id === actionItemId
              ? {
                  ...item,
                  status: item.status === 'completed' ? ('pending' as const) : ('completed' as const),
                }
              : item
          ),
        };
      }
      return m;
    });
    setMeetings(updated);
    saveState(STORAGE_KEYS.MEETINGS, updated);
  };

  // Report actions
  const submitWeeklyReport = (reportData: Partial<WeeklyReport>) => {
    const existingIndex = reports.findIndex(
      (r) =>
        r.user_id === (reportData.user_id || user?.id) &&
        r.reporting_week_start === reportData.reporting_week_start
    );

    let updated: WeeklyReport[];
    if (existingIndex >= 0) {
      updated = [...reports];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...reportData,
        status: reportData.status || 'submitted',
        updated_at: new Date().toISOString(),
      };
    } else {
      const newReport: WeeklyReport = {
        id: `rep-${Date.now()}`,
        user_id: user?.id || profiles[2].id,
        reporting_week_start:
          reportData.reporting_week_start ||
          new Date(Date.now() - (new Date().getDay() - 1) * 86400000)
            .toISOString()
            .split('T')[0],
        tasks_completed: reportData.tasks_completed || '',
        work_in_progress: reportData.work_in_progress || '',
        pending_tasks: reportData.pending_tasks || '',
        blockers: reportData.blockers || '',
        next_week_plan: reportData.next_week_plan || '',
        additional_notes: reportData.additional_notes || '',
        status: reportData.status || 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [newReport, ...reports];
    }

    setReports(updated);
    saveState(STORAGE_KEYS.REPORTS, updated);
    logActivity('weekly_report', reportData.id || 'new', 'submitted_weekly_report');
  };

  const reviewWeeklyReport = (reportId: string, status: ReportStatus, feedback: string) => {
    const updated = reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status,
            admin_feedback: feedback,
            reviewed_by: user?.id || profiles[0].id,
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : r
    );
    setReports(updated);
    saveState(STORAGE_KEYS.REPORTS, updated);

    // Notify report author
    const targetReport = reports.find((r) => r.id === reportId);
    if (targetReport) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        user_id: targetReport.user_id,
        title: 'Weekly Report Reviewed',
        message: `${user?.full_name || 'Admin'} reviewed your weekly report: "${feedback.slice(0, 50)}..."`,
        type: 'report_feedback',
        link: '/reports',
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  // Notification actions
  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    setNotifications(updated);
    saveState(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, is_read: true }));
    setNotifications(updated);
    saveState(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  // Team actions
  const addTeamMember = (memberData: Partial<Profile>) => {
    const newMember: Profile = {
      id: `usr-${Date.now()}`,
      email: memberData.email || 'user@exoft.tech',
      full_name: memberData.full_name || 'New Team Member',
      role: memberData.role || 'employee',
      designation: memberData.designation || 'Engineer',
      department: memberData.department || 'Engineering',
      phone: memberData.phone || '',
      status: 'active',
      avatar_url:
        memberData.avatar_url ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString(),
    };
    const updated = [...profiles, newMember];
    setProfiles(updated);
    saveState(STORAGE_KEYS.PROFILES, updated);
    logActivity('team', newMember.id, 'added_team_member', { name: newMember.full_name });
  };

  const updateTeamMember = (id: string, updates: Partial<Profile>) => {
    const updated = profiles.map((p) =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    setProfiles(updated);
    saveState(STORAGE_KEYS.PROFILES, updated);
  };

  const createAnnouncement = (announcementData: Partial<Announcement>) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: announcementData.title || 'Untitled Announcement',
      content: announcementData.content || '',
      category: announcementData.category || 'announcement',
      created_at: new Date().toISOString(),
      author_name: user?.full_name || 'Alex Vance',
      author_role: user?.role === 'admin' ? 'Executive Leadership' : 'Team Member',
      is_pinned: announcementData.is_pinned ?? false,
      link: announcementData.link || '',
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveState(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    logActivity('team', newAnn.id, 'posted_announcement', { title: newAnn.title });
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    saveState(STORAGE_KEYS.ANNOUNCEMENTS, updated);
  };

  // =========================================================================
  // CLIENT ACTIONS
  // =========================================================================
  const createClient = (clientData: Partial<Client>): Client => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      company_name: clientData.company_name || 'New Client Company',
      client_type: clientData.client_type || 'small_business',
      primary_contact_name: clientData.primary_contact_name || '',
      contact_email: clientData.contact_email || '',
      contact_phone: clientData.contact_phone || '',
      website: clientData.website || '',
      industry: clientData.industry || 'Technology',
      address_country: clientData.address_country || '',
      communication_channel: clientData.communication_channel || 'email',
      additional_stakeholders: clientData.additional_stakeholders || [],
      billing_contact: clientData.billing_contact,
      notes: clientData.notes || '',
      created_at: new Date().toISOString(),
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    saveState(STORAGE_KEYS.CLIENTS, updated);
    logActivity('client', newClient.id, 'created_client', { name: newClient.company_name });
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updated = clients.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setClients(updated);
    saveState(STORAGE_KEYS.CLIENTS, updated);
  };

  // =========================================================================
  // PROJECT INITIATION & SOP WIZARD ACTIONS
  // =========================================================================
  const saveProjectDraft = (draftData: Partial<ProjectInitiationDraft>): string => {
    const draftId = draftData.id || `draft-${Date.now()}`;
    const existingIndex = projectDrafts.findIndex((d) => d.id === draftId);

    const mergedDraft: ProjectInitiationDraft = {
      id: draftId,
      current_step: draftData.current_step || 1,
      client_id: draftData.client_id,
      client: draftData.client || {},
      project_name: draftData.project_name || '',
      project_code:
        draftData.project_code ||
        `EXOF-2026-${Math.floor(100 + Math.random() * 900)}`,
      project_type: draftData.project_type || 'saas',
      summary: draftData.summary || '',
      business_problem: draftData.business_problem || '',
      main_objectives: draftData.main_objectives || '',
      target_audience: draftData.target_audience || '',
      target_platforms: draftData.target_platforms || ['Web'],
      priority: draftData.priority || 'medium',
      project_manager_id: draftData.project_manager_id || profiles[0].id,
      team_member_ids: draftData.team_member_ids || [],
      start_date: draftData.start_date || new Date().toISOString().split('T')[0],
      target_delivery_date:
        draftData.target_delivery_date ||
        new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      confidentiality_level: draftData.confidentiality_level || 'standard',
      assumptions_constraints_risks: draftData.assumptions_constraints_risks || '',
      requirements: draftData.requirements || [],
      project_type_answers: draftData.project_type_answers || {},
      technical_specs: draftData.technical_specs || {
        frontend_tech: 'Next.js 16 (App Router) & Tailwind CSS',
        backend_tech: 'Node.js & TypeScript',
        database_tech: 'PostgreSQL 16',
        hosting_deployment: 'Vercel & AWS',
        domain_dns: '',
        auth_specs: 'OAuth2 / Supabase Auth RBAC',
        required_integrations: '',
        file_storage: 'AWS S3',
        expected_scale: '10,000 - 50,000 Monthly Active Users',
        security_backup: 'Daily automated snapshots with RLS',
        source_repo_status: 'Private GitHub Repository',
        environments: ['dev', 'staging', 'production'],
        monitoring_logging: 'Sentry error telemetry',
        maintenance_expectations: '30-day warranty followed by monthly retainer',
        technical_recommendations_needed: false,
      },
      commercial: draftData.commercial || {
        currency: 'USD',
        pricing_model: 'milestone_based',
        contract_status: 'draft',
        payment_milestones: [
          { id: 'm1', title: 'Initiation & SRS Sign-off', amount_percentage: 30, trigger_condition: 'Approved SRS and Architecture' },
          { id: 'm2', title: 'Beta & Staging Review', amount_percentage: 40, trigger_condition: 'Feature-complete UAT walkthrough' },
          { id: 'm3', title: 'Production Launch & Handover', amount_percentage: 30, trigger_condition: 'Production cutover and training delivery' },
        ],
        target_delivery_date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
        client_dependencies: 'Client asset approvals within 48h',
        expected_response_time: '24 business hours',
        warranty_support_period: '60 days post-launch warranty',
        post_launch_maintenance: 'Standard SLA retainer',
      },
      documents: draftData.documents || [
        { id: 'doc-1', title: 'Client Product Brief', category: 'client_brief', version: 'v1.0', status: 'draft', owner_name: 'Alex Vance', due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-2', title: 'Software Requirements Specification (SRS)', category: 'srs', version: 'v0.9', status: 'draft', owner_name: 'Elena Rostova', due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-3', title: 'Project Proposal & Quotation', category: 'proposal_quotation', version: 'v1.0', status: 'draft', owner_name: 'Alex Vance', due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-4', title: 'Project Scope and Exclusions', category: 'scope_exclusions', version: 'v1.0', status: 'draft', owner_name: 'Elena Rostova', due_date: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-5', title: 'Project Plan and Milestones', category: 'project_plan', version: 'v0.5', status: 'draft', owner_name: 'Alex Vance', due_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-6', title: 'UI/UX Design and Prototype Sign-Off', category: 'ui_ux_design', version: 'v0.5', status: 'draft', owner_name: 'Anya Sharma', due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-7', title: 'Technical Architecture & Infrastructure', category: 'technical_architecture', version: 'v1.0', status: 'draft', owner_name: 'Sofia Chen', due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-8', title: 'Database Schema & API Specifications', category: 'database_api', version: 'v0.5', status: 'draft', owner_name: 'Sofia Chen', due_date: new Date(Date.now() + 16 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-9', title: 'QA Test Plan & Traceability Matrix', category: 'test_plan', version: 'v0.1', status: 'missing', owner_name: 'David Kim', due_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-10', title: 'User Acceptance Testing (UAT) Guide', category: 'uat', version: 'v0.1', status: 'missing', owner_name: 'Elena Rostova', due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-11', title: 'Production Deployment & Rollout Plan', category: 'deployment_plan', version: 'v0.1', status: 'missing', owner_name: 'Sofia Chen', due_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
        { id: 'doc-12', title: 'Handover & Post-Launch Maintenance Plan', category: 'handover_maintenance', version: 'v0.1', status: 'missing', owner_name: 'Alex Vance', due_date: new Date(Date.now() + 55 * 86400000).toISOString().split('T')[0], updated_at: new Date().toISOString() },
      ],
      srs: draftData.srs || {
        version: 'v0.9',
        status: 'draft',
        purpose_scope: draftData.summary || 'Define functional, architectural, and operational requirements for project delivery.',
        product_overview: draftData.business_problem || 'Comprehensive product description and system scope.',
        business_objectives: draftData.main_objectives || 'Deliver high quality, secure, scalable digital software on schedule.',
        stakeholders: 'Client Executive Sponsors, Exoft Technologies Engineering & QA.',
        user_roles_permissions: 'Standard User, Administrator, Operations Auditor.',
        functional_requirements: 'Core feature set and user journeys detailed in requirements registry.',
        non_functional_requirements: '99.9% availability, TLS 1.3 encryption, sub-500ms API response time.',
        user_journeys: 'End-to-end user workflows from authentication to transaction fulfillment.',
        external_interfaces: 'RESTful JSON APIs, OAuth2 authentication, webhook callbacks.',
        data_requirements: 'Relational database schema with encryption at rest and automated backups.',
        security_privacy: 'Role-based access control (RBAC), sanitized inputs, OWASP compliance.',
        performance_scalability: 'Horizontally scalable containerized services with CDN caching.',
        assumptions_constraints: 'Client provisions third-party licenses and credentials on schedule.',
        out_of_scope: 'Features explicitly deferred to subsequent phases or post-launch backlog.',
        acceptance_criteria: 'All functional tests passing in staging, zero critical blockers, client UAT sign-off.',
        risks_dependencies: 'Third-party API availability and sandbox test credentials delivery.',
        open_questions: 'Clarify SLA response thresholds for tier-2 support requests.',
        updated_at: new Date().toISOString(),
      },
      readiness_status: draftData.readiness_status || 'in_progress',
      readiness_checks: draftData.readiness_checks || {
        client_info_recorded: Boolean(draftData.client?.company_name && draftData.client?.contact_email),
        scope_documented: Boolean(draftData.project_name && draftData.summary),
        key_requirements_recorded: (draftData.requirements?.length || 0) >= 2,
        acceptance_criteria_exist: (draftData.requirements || []).some((r) => Boolean(r.acceptance_criteria)),
        pm_assigned: Boolean(draftData.project_manager_id),
        milestones_defined: (draftData.commercial?.payment_milestones?.length || 0) >= 2,
        technical_feasibility_reviewed: Boolean(draftData.technical_specs?.frontend_tech),
        commercial_approvals_recorded: draftData.commercial?.contract_status !== 'draft',
        srs_approved_or_exception: draftData.srs?.status === 'approved',
        documents_attached_or_assigned: (draftData.documents?.length || 0) >= 8,
      },
      approval_status: draftData.approval_status || 'pending',
      approval_comments: draftData.approval_comments,
      approved_by: draftData.approved_by,
      approved_at: draftData.approved_at,
      is_kicked_off: draftData.is_kicked_off || false,
      kicked_off_at: draftData.kicked_off_at,
      kicked_off_project_id: draftData.kicked_off_project_id,
      created_at: draftData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let updatedDrafts: ProjectInitiationDraft[];
    if (existingIndex >= 0) {
      updatedDrafts = [...projectDrafts];
      updatedDrafts[existingIndex] = mergedDraft;
    } else {
      updatedDrafts = [mergedDraft, ...projectDrafts];
    }

    setProjectDrafts(updatedDrafts);
    saveState(STORAGE_KEYS.PROJECT_DRAFTS, updatedDrafts);
    logActivity('project_initiation', draftId, 'saved_project_draft', { name: mergedDraft.project_name });
    return draftId;
  };

  const getProjectDraft = (id: string): ProjectInitiationDraft | undefined => {
    return projectDrafts.find((d) => d.id === id);
  };

  const deleteProjectDraft = (id: string) => {
    const updated = projectDrafts.filter((d) => d.id !== id);
    setProjectDrafts(updated);
    saveState(STORAGE_KEYS.PROJECT_DRAFTS, updated);
  };

  const approveProjectInitiation = (draftId: string, comments: string, approverId: string) => {
    const draft = projectDrafts.find((d) => d.id === draftId);
    if (!draft) return;

    const approver = profiles.find((p) => p.id === approverId) || profiles[0];

    const updated = projectDrafts.map((d) =>
      d.id === draftId
        ? {
            ...d,
            approval_status: 'approved' as const,
            approval_comments: comments,
            approved_by: approver.full_name,
            approved_at: new Date().toISOString(),
            readiness_status: 'ready_for_kickoff' as const,
            readiness_checks: {
              ...d.readiness_checks,
              srs_approved_or_exception: true,
              commercial_approvals_recorded: true,
            },
            updated_at: new Date().toISOString(),
          }
        : d
    );

    setProjectDrafts(updated);
    saveState(STORAGE_KEYS.PROJECT_DRAFTS, updated);
    logActivity('project_initiation', draftId, 'approved_project_initiation', {
      approver: approver.full_name,
      comments,
    });

    // Notify project manager
    if (draft.project_manager_id) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        user_id: draft.project_manager_id,
        title: 'Project Initiation Approved',
        message: `${approver.full_name} approved initiation for "${draft.project_name}". Ready for Project Kickoff.`,
        type: 'project_initiated',
        link: `/projects/new?draftId=${draftId}`,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const generateLifecycleStages = (projectType: string): ProjectStage[] => {
    switch (projectType) {
      case 'website':
        return [
          { id: 'stg-1', name: 'Discovery & Content Strategy', slug: 'discovery', description: 'Information architecture, sitemap, brand copy, and asset collection.', order: 1, status: 'in_progress', required_gates: ['Client brief signed', 'Brand assets received'] },
          { id: 'stg-2', name: 'UI/UX Wireframes & Design', slug: 'design', description: 'Responsive layouts, navigation design, interactive prototypes in Figma.', order: 2, status: 'pending', required_gates: ['Figma design approved'] },
          { id: 'stg-3', name: 'Frontend Component Architecture', slug: 'frontend', description: 'Next.js components, Tailwind CSS styling, responsive grid implementation.', order: 3, status: 'pending' },
          { id: 'stg-4', name: 'CMS & Form Integrations', slug: 'integrations', description: 'Lead capture forms, CRM webhooks, newsletter subscription API.', order: 4, status: 'pending' },
          { id: 'stg-5', name: 'SEO & Performance Audit', slug: 'seo_performance', description: 'Meta tags, OpenGraph, sitemap.xml, 95+ Lighthouse score audit.', order: 5, status: 'pending' },
          { id: 'stg-6', name: 'Cross-Browser QA Testing', slug: 'qa', description: 'Safari, Chrome, Firefox, iOS, Android compatibility testing.', order: 6, status: 'pending' },
          { id: 'stg-7', name: 'Client Staging Review', slug: 'client_review', description: 'Staging deployment and client sign-off on final deliverables.', order: 7, status: 'pending' },
          { id: 'stg-8', name: 'Production Launch & DNS Cutover', slug: 'deployment', description: 'Domain routing, SSL certificate verification, edge CDN caching.', order: 8, status: 'pending' },
          { id: 'stg-9', name: 'Post-Launch Analytics & Handoff', slug: 'handover', description: 'Google Analytics verification, CMS guide delivery to client.', order: 9, status: 'pending' },
          { id: 'stg-10', name: 'Warranty & Maintenance Support', slug: 'maintenance', description: '30-day bug resolution warranty and uptime monitoring.', order: 10, status: 'pending' },
        ];
      case 'ecommerce':
        return [
          { id: 'stg-1', name: 'Discovery & Catalog Planning', slug: 'discovery', description: 'SKU hierarchy, tax rules, multi-currency matrix, payment gateway scope.', order: 1, status: 'in_progress' },
          { id: 'stg-2', name: 'Storefront UI/UX Design', slug: 'design', description: 'High-converting product detail pages, cart drawer, checkout UX.', order: 2, status: 'pending' },
          { id: 'stg-3', name: 'Database & Catalog Infrastructure', slug: 'catalog_db', description: 'PostgreSQL product schemas, variant matrices, stock level sync.', order: 3, status: 'pending' },
          { id: 'stg-4', name: 'Cart & Stripe Checkout Integration', slug: 'checkout_payments', description: 'PCI-compliant Stripe Elements, 3D Secure, invoice generation.', order: 4, status: 'pending' },
          { id: 'stg-5', name: 'Order Management & Webhooks', slug: 'order_pipeline', description: 'Order status lifecycle, fulfillment triggers, customer email notifications.', order: 5, status: 'pending' },
          { id: 'stg-6', name: 'Security & PCI Compliance QA', slug: 'security_qa', description: 'Penetration testing, rate limiting on checkout endpoints, bot protection.', order: 6, status: 'pending' },
          { id: 'stg-7', name: 'Payment Sandbox & UAT', slug: 'uat', description: 'Synthetic transactions, test card scenarios, client acceptance.', order: 7, status: 'pending' },
          { id: 'stg-8', name: 'Production Deployment', slug: 'deployment', description: 'Live Stripe keys provisioning, production database migration, CDN cutover.', order: 8, status: 'pending' },
          { id: 'stg-9', name: 'Client Operations Handover', slug: 'handover', description: 'Admin order management training, refund workflow SOP delivery.', order: 9, status: 'pending' },
          { id: 'stg-10', name: 'Post-Launch Monitoring & SLA', slug: 'maintenance', description: 'Live transaction error alerting, webhook retry queue monitoring.', order: 10, status: 'pending' },
        ];
      case 'mobile_app':
        return [
          { id: 'stg-1', name: 'Discovery & User Flow Architecture', slug: 'discovery', description: 'User personas, navigation stacks, offline-first sync architecture.', order: 1, status: 'in_progress' },
          { id: 'stg-2', name: 'Mobile UI/UX Prototyping', slug: 'design', description: 'iOS Human Interface & Android Material Design interactive flows.', order: 2, status: 'pending' },
          { id: 'stg-3', name: 'Core Mobile App Architecture', slug: 'mobile_core', description: 'React Native / Flutter project scaffolding, state management, secure storage.', order: 3, status: 'pending' },
          { id: 'stg-4', name: 'Backend API & Sync Services', slug: 'backend_api', description: 'REST / GraphQL endpoints, biometric session auth, rate limiting.', order: 4, status: 'pending' },
          { id: 'stg-5', name: 'Push Notifications & Hardware APIs', slug: 'hardware_notifications', description: 'APNs, FCM integration, camera QR scanning, geolocation.', order: 5, status: 'pending' },
          { id: 'stg-6', name: 'Physical Device QA Matrix', slug: 'qa_device_matrix', description: 'Testing on iPhones, Samsung, Pixel across various screen sizes & OS versions.', order: 6, status: 'pending' },
          { id: 'stg-7', name: 'Beta Testing (TestFlight & Internal Play)', slug: 'beta_uat', description: 'Client stakeholder testing, feedback triage, crash analytics.', order: 7, status: 'pending' },
          { id: 'stg-8', name: 'App Store & Google Play Review', slug: 'store_submission', description: 'Privacy manifests, screenshots, store listing metadata, compliance review.', order: 8, status: 'pending' },
          { id: 'stg-9', name: 'Production Release & Rollout', slug: 'deployment', description: 'Phased staged rollout, crashlytics real-time monitoring.', order: 9, status: 'pending' },
          { id: 'stg-10', name: 'OS Compatibility & SLA Support', slug: 'maintenance', description: 'Quarterly OS SDK updates, bug fixing, performance monitoring.', order: 10, status: 'pending' },
        ];
      default:
        return [
          { id: 'stg-1', name: 'Discovery and Requirements', slug: 'discovery', description: 'Stakeholder alignment, business objective validation, scope freeze.', order: 1, status: 'in_progress' },
          { id: 'stg-2', name: 'Planning and Estimation', slug: 'planning', description: 'Sprint breakdown, capacity planning, risk register finalization.', order: 2, status: 'pending' },
          { id: 'stg-3', name: 'UI/UX Design', slug: 'design', description: 'Design tokens, layout prototypes, design system review.', order: 3, status: 'pending' },
          { id: 'stg-4', name: 'Technical Setup', slug: 'tech_setup', description: 'Repository scaffolding, CI/CD pipelines, staging environments.', order: 4, status: 'pending' },
          { id: 'stg-5', name: 'Development', slug: 'development', description: 'Core functional deliverable implementation and unit testing.', order: 5, status: 'pending' },
          { id: 'stg-6', name: 'Quality Assurance', slug: 'qa', description: 'Automated test suites, regression testing, performance audits.', order: 6, status: 'pending' },
          { id: 'stg-7', name: 'Client Review and UAT', slug: 'uat', description: 'Client walkthroughs, user acceptance sign-off, final defect remediation.', order: 7, status: 'pending' },
          { id: 'stg-8', name: 'Deployment', slug: 'deployment', description: 'Production provisioning, zero-downtime release, smoke testing.', order: 8, status: 'pending' },
          { id: 'stg-9', name: 'Handover', slug: 'handover', description: 'System documentation, administrative credentials handoff, staff training.', order: 9, status: 'pending' },
          { id: 'stg-10', name: 'Maintenance', slug: 'maintenance', description: 'Ongoing support, security patches, system health telemetry.', order: 10, status: 'pending' },
        ];
    }
  };

  const kickoffProject = (
    draftId: string,
    kickoffMeetingDate?: string
  ): { project: Project; generatedTasksCount: number } => {

    const draft = projectDrafts.find((d) => d.id === draftId);
    if (!draft) {
      throw new Error('Project initiation draft not found.');
    }

    // Guard against running initiation twice (duplicate prevention)
    if (draft.is_kicked_off && draft.kicked_off_project_id) {
      const existingProject = projects.find((p) => p.id === draft.kicked_off_project_id);
      if (existingProject) {
        return { project: existingProject, generatedTasksCount: 0 };
      }
    }

    // 1. Generate Lifecycle Stages from template based on project type
    const stages = generateLifecycleStages(draft.project_type || 'saas');

    // 2. Assign team members
    const teamIds =
      draft.team_member_ids?.length > 0
        ? draft.team_member_ids
        : profiles.filter((p) => p.role === 'employee').slice(0, 3).map((p) => p.id);

    const pm = profiles.find((p) => p.id === draft.project_manager_id) || profiles[0];

    // 3. Create active Project
    const newProjectId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newProjectId,
      name: draft.project_name || 'New Client Project',
      project_code: draft.project_code || `EXOF-${Math.floor(100 + Math.random() * 900)}`,
      project_type: draft.project_type || 'saas',
      client_id: draft.client_id,
      client_name: draft.client?.company_name || 'Client Deliverable',
      client_type: draft.client?.client_type,
      description: draft.summary || 'Project initiated via Exoft Flow SOP Wizard.',
      project_manager_id: pm.id,
      project_manager: pm,
      start_date: draft.start_date || new Date().toISOString().split('T')[0],
      deadline: draft.target_delivery_date || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      priority: draft.priority || 'high',
      status: 'active',
      progress: 5,
      created_by: user?.id || profiles[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      member_ids: teamIds,
      members: profiles.filter((p) => teamIds.includes(p.id)),
      lifecycle_stages: stages,
      documents: draft.documents,
      srs: draft.srs,
      sop_activated_at: new Date().toISOString(),
      draft_id: draft.id,
    };

    // 4. Generate pipeline tasks from approved requirements & lifecycle stages
    const generatedTasks: Task[] = [];

    // Stage 1 Milestone Task
    generatedTasks.push({
      id: `task-gen-${Date.now()}-1`,
      project_id: newProjectId,
      title: `SOP Kickoff & Scope Alignment: ${draft.project_name}`,
      description: `Review approved requirements and align team on milestone deliverables for Stage 1: ${stages[0].name}.`,
      priority: 'high',
      status: 'in_progress',
      progress: 25,
      start_date: draft.start_date,
      due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      assignee_ids: [pm.id],
      assignees: [pm],
      created_by: user?.id || profiles[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Generate tasks for each requirement
    (draft.requirements || []).forEach((req, idx) => {
      const assignedEmployeeId = teamIds[idx % teamIds.length] || teamIds[0];
      const assignee = profiles.find((p) => p.id === assignedEmployeeId) || profiles[2];

      generatedTasks.push({
        id: `task-gen-${Date.now()}-${idx + 2}`,
        project_id: newProjectId,
        title: `Deliverable: ${req.title}`,
        description: `${req.description}\n\nAcceptance Criteria: ${req.acceptance_criteria}`,
        priority: req.priority === 'must_have' ? 'urgent' : req.priority === 'should_have' ? 'high' : 'medium',
        status: 'todo',
        progress: 0,
        start_date: draft.start_date,
        due_date: new Date(Date.now() + (12 + idx * 7) * 86400000).toISOString().split('T')[0],
        assignee_ids: [assignedEmployeeId],
        assignees: [assignee],
        created_by: user?.id || profiles[0].id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });

    // Generate follow-up tasks for any outstanding or draft documents
    (draft.documents || [])
      .filter((doc) => doc.status === 'missing' || doc.status === 'draft')
      .slice(0, 3)
      .forEach((doc, idx) => {
        const assignedEmployeeId = teamIds[(idx + 1) % teamIds.length] || teamIds[0];
        const assignee = profiles.find((p) => p.id === assignedEmployeeId) || profiles[3];

        generatedTasks.push({
          id: `task-doc-${Date.now()}-${idx}`,
          project_id: newProjectId,
          title: `SOP Document: Finalize ${doc.title}`,
          description: `Author and submit the ${doc.category.replace('_', ' ')} documentation for Admin review and approval.`,
          priority: 'medium',
          status: 'todo',
          progress: 0,
          start_date: draft.start_date,
          due_date: doc.due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          assignee_ids: [assignedEmployeeId],
          assignees: [assignee],
          created_by: user?.id || profiles[0].id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      });

    // 5. Schedule Kickoff Meeting in Meetings system
    const kickoffTime =
      kickoffMeetingDate ||
      new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T10:00:00Z';

    const newMeeting: Meeting = {
      id: `mtg-${Date.now()}`,
      title: `Project Kickoff: ${draft.project_name} (${draft.project_code})`,
      description: `Formal project kickoff and SOP review with engineering team and project manager.`,
      start_time: kickoffTime,
      end_time: new Date(new Date(kickoffTime).getTime() + 3600000).toISOString(),
      creator_id: user?.id || profiles[0].id,
      creator: user || profiles[0],
      project_id: newProjectId,
      agenda: `1. Project Objectives & Business Problem\n2. Review Approved SRS & Technical Stack\n3. Assign Stage 1 Tasks & Milestones\n4. Establish Client Communication SOP`,
      meeting_type: 'weekly_tuesday',
      recurrence: 'none',
      status: 'scheduled',
      participants: profiles.filter((p) => [pm.id, ...teamIds].includes(p.id)),
      participant_ids: [pm.id, ...teamIds],
      created_at: new Date().toISOString(),
    };

    // 6. Notify assigned team members
    const newNotifications: Notification[] = teamIds.map((memberId) => ({
      id: `notif-kickoff-${memberId}-${Date.now()}`,
      user_id: memberId,
      title: `Assigned to ${draft.project_name}`,
      message: `You have been assigned to ${draft.project_name} (${draft.project_code}). Kickoff meeting scheduled.`,
      type: 'project_kickoff',
      link: `/projects/${newProjectId}`,
      is_read: false,
      created_at: new Date().toISOString(),
    }));

    // 7. Update draft state
    const updatedDrafts = projectDrafts.map((d) =>
      d.id === draftId
        ? {
            ...d,
            is_kicked_off: true,
            kicked_off_at: new Date().toISOString(),
            kicked_off_project_id: newProjectId,
            updated_at: new Date().toISOString(),
          }
        : d
    );

    // Save all to states and localStorage
    const updatedProjects = [newProject, ...projects];
    const updatedTasks = [...generatedTasks, ...tasks];
    const updatedMeetings = [newMeeting, ...meetings];
    const updatedNotifs = [...newNotifications, ...notifications];

    setProjects(updatedProjects);
    setTasks(updatedTasks);
    setMeetings(updatedMeetings);
    setNotifications(updatedNotifs);
    setProjectDrafts(updatedDrafts);

    saveState(STORAGE_KEYS.PROJECTS, updatedProjects);
    saveState(STORAGE_KEYS.TASKS, updatedTasks);
    saveState(STORAGE_KEYS.MEETINGS, updatedMeetings);
    saveState(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
    saveState(STORAGE_KEYS.PROJECT_DRAFTS, updatedDrafts);

    logActivity('project', newProjectId, 'project_kicked_off', {
      project_code: draft.project_code,
      stages_count: stages.length,
      tasks_generated: generatedTasks.length,
    });

    return { project: newProject, generatedTasksCount: generatedTasks.length };
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        meetings,
        reports,
        notifications,
        activityLogs,
        profiles,
        announcements,
        clients,
        projectDrafts,
        createAnnouncement,
        deleteAnnouncement,
        createClient,
        updateClient,
        saveProjectDraft,
        getProjectDraft,
        deleteProjectDraft,
        approveProjectInitiation,
        kickoffProject,
        createTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        addWarningAlert,
        clearWarningAlert,
        submitTaskProof,
        toggleTaskComplete,
        createProject,
        updateProject,
        createMeeting,
        updateMeetingMinutes,
        addActionItem,
        toggleActionItemStatus,
        submitWeeklyReport,
        reviewWeeklyReport,
        markNotificationRead,
        markAllNotificationsRead,
        addTeamMember,
        updateTeamMember,
        getProfileById,
        getProjectById,
      }}
    >
      {children}
    </DataContext.Provider>
  );


}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
