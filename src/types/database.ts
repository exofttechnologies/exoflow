export type UserRole = 'admin' | 'employee';

export type AccountStatus = 'active' | 'inactive';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  designation: string;
  department: string;
  phone?: string;
  status: AccountStatus;
  created_at: string;
  updated_at?: string;
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  name: string;
  description: string;
  project_code?: string;
  project_type?: ProjectType;
  client_id?: string;
  client_name?: string;
  client_type?: string;
  project_manager_id: string;
  project_manager?: Profile;
  start_date: string;
  deadline: string;
  priority: PriorityLevel;
  status: ProjectStatus;
  progress: number;
  created_by: string;
  created_at: string;
  updated_at?: string;
  members?: Profile[];
  member_ids?: string[];
  tasks_count?: number;
  completed_tasks_count?: number;
  overdue_tasks_count?: number;
  // Core project scope & details (all optional, editable later)
  scope?: string;
  features?: string[];
  modules?: string[];
  other_requirements?: string;
  estimate?: string;
  lifecycle_stages?: ProjectStage[];
  documents?: ProjectDocument[];
  srs?: SRSDocument;
  sop_activated_at?: string;
  draft_id?: string;
}


export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'in_review' | 'completed';

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user?: Profile;
  content: string;
  is_blocker?: boolean;
  created_at: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size?: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  project?: Project;
  title: string;
  description: string;
  created_by: string;
  created_by_user?: Profile;
  priority: PriorityLevel;
  status: TaskStatus;
  progress: number;
  start_date: string;
  due_date: string;
  blocker_description?: string;
  warning_alert?: string;
  proof_url?: string;
  proof_note?: string;
  proof_submitted_at?: string;
  assignees: Profile[];
  assignee_ids?: string[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  created_at: string;
  updated_at: string;
}

export type MeetingType = 'weekly_tuesday' | 'planning' | 'client_review' | 'standup' | 'adhoc';
export type MeetingRecurrence = 'none' | 'weekly_tuesday' | 'biweekly' | 'monthly';
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface MeetingActionItem {
  id: string;
  meeting_id: string;
  assignee_id: string;
  assignee?: Profile;
  title: string;
  description?: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  creator_id: string;
  creator?: Profile;
  project_id?: string;
  project?: Project;
  agenda: string;
  meeting_type: MeetingType;
  recurrence: MeetingRecurrence;
  status: MeetingStatus;
  minutes?: string;
  decisions?: string;
  blockers?: string;
  participants: Profile[];
  participant_ids?: string[];
  action_items?: MeetingActionItem[];
  created_at: string;
  updated_at?: string;
}

export type ReportStatus = 'draft' | 'submitted' | 'reviewed' | 'needs_revision';

export interface WeeklyReport {
  id: string;
  user_id: string;
  user?: Profile;
  reporting_week_start: string;
  tasks_completed: string;
  work_in_progress: string;
  pending_tasks: string;
  blockers?: string;
  next_week_plan: string;
  additional_notes?: string;
  status: ReportStatus;
  admin_feedback?: string;
  reviewed_by?: string;
  reviewer?: Profile;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export type NotificationType =
  | 'task_assigned'
  | 'deadline_reminder'
  | 'task_overdue'
  | 'meeting_invite'
  | 'meeting_action'
  | 'meeting_reminder'
  | 'report_reminder'
  | 'report_feedback'
  | 'warning'
  | 'proof_submitted'
  | 'project_initiated'
  | 'project_kickoff'
  | 'srs_approval';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'alert' | 'update' | 'milestone';
  created_at: string;
  author_name: string;
  author_role: string;
  is_pinned?: boolean;
  link?: string;
}

export interface ActivityLog {
  id: string;
  actor_id: string;
  actor?: Profile;
  entity_type: 'project' | 'task' | 'meeting' | 'weekly_report' | 'team' | 'project_initiation' | 'client';
  entity_id: string;
  action: string;
  details?: Record<string, any>;
  created_at: string;
}

// =========================================================================
// PROJECT INITIATION & SOP (STANDARD OPERATING PROCEDURE) TYPES
// =========================================================================

export type ClientType = 'individual' | 'startup' | 'small_business' | 'enterprise' | 'other';
export type CommunicationChannel = 'slack' | 'email' | 'teams' | 'whatsapp' | 'phone';

export interface ClientStakeholder {
  name: string;
  role: string;
  email?: string;
}

export interface Client {
  id: string;
  company_name: string;
  client_type: ClientType;
  primary_contact_name: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  industry: string;
  address_country?: string;
  communication_channel: CommunicationChannel;
  additional_stakeholders?: ClientStakeholder[];
  billing_contact?: { name: string; email: string; phone?: string };
  notes?: string;
  created_at: string;
}

export type ProjectType =
  | 'website'
  | 'ecommerce'
  | 'mobile_app'
  | 'saas'
  | 'custom_software'
  | 'internal_tool'
  | 'api_integration'
  | 'other';

export type ConfidentialityLevel = 'standard' | 'confidential' | 'strictly_confidential';

export type RequirementType = 'functional' | 'non_functional' | 'integration' | 'security' | 'other';
export type RequirementPriority = 'must_have' | 'should_have' | 'could_have' | 'out_of_scope';

export interface ProjectRequirement {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  priority: RequirementPriority;
  acceptance_criteria: string;
  related_module: string;
  notes?: string;
}

export interface ProjectTechnicalSpecs {
  frontend_tech: string;
  backend_tech: string;
  database_tech: string;
  hosting_deployment: string;
  domain_dns: string;
  auth_specs: string;
  required_integrations: string;
  file_storage: string;
  expected_scale: string;
  security_backup: string;
  source_repo_status: string;
  environments: string[];
  monitoring_logging: string;
  maintenance_expectations: string;
  technical_recommendations_needed: boolean;
}

export type PricingModel = 'fixed_price' | 'time_and_materials' | 'milestone_based' | 'internal_project';

export interface PaymentMilestone {
  id: string;
  title: string;
  amount_percentage: number;
  trigger_condition: string;
  due_date?: string;
}

export interface ProjectCommercialDetails {
  estimated_budget?: number;
  currency: string;
  pricing_model: PricingModel;
  proposal_quote_ref?: string;
  contract_status: 'draft' | 'under_review' | 'signed' | 'pending_client' | 'internal_approved';
  payment_milestones: PaymentMilestone[];
  target_delivery_date: string;
  client_dependencies: string;
  expected_response_time: string;
  external_service_costs?: string;
  warranty_support_period: string;
  post_launch_maintenance: string;
  commercial_notes?: string;
}

export type DocumentCategory =
  | 'msa'
  | 'nda'
  | 'sow'
  | 'client_brief'
  | 'srs'
  | 'proposal_quotation'
  | 'scope_exclusions'
  | 'project_plan'
  | 'ui_ux_design'
  | 'technical_architecture'
  | 'database_api'
  | 'test_plan'
  | 'uat'
  | 'deployment_plan'
  | 'handover_maintenance'
  | 'architecture_diagram'
  | 'api_spec'
  | 'design_system'
  | 'security_audit'
  | 'qa_test_plan'
  | 'deployment_runbook'
  | 'handover_manual'
  | 'sla_agreement';

export type DocumentStatus = 'missing' | 'draft' | 'in_review' | 'approved' | 'rejected' | 'signed';

export interface ProjectDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  version: string;
  status: DocumentStatus;
  required?: boolean;
  owner_id?: string;
  owner_name?: string;
  due_date?: string;
  document_url?: string;
  review_comments?: string;
  approved_by?: string;
  approved_at?: string;
  updated_at: string;
}

export interface SRSDocument {
  version: string;
  status: 'draft' | 'in_review' | 'approved';
  purpose_scope: string;
  product_overview: string;
  business_objectives: string;
  stakeholders: string;
  user_roles_permissions: string;
  functional_requirements: string;
  non_functional_requirements: string;
  user_journeys: string;
  external_interfaces: string;
  data_requirements: string;
  security_privacy: string;
  performance_scalability: string;
  assumptions_constraints: string;
  out_of_scope: string;
  acceptance_criteria: string;
  risks_dependencies: string;
  open_questions: string;
  approved_by?: string;
  approved_at?: string;
  updated_at: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed';
  required_gates?: string[];
  tasks_count?: number;
}

export type ReadinessState =
  | 'not_started'
  | 'in_progress'
  | 'awaiting_client'
  | 'awaiting_approval'
  | 'ready_for_kickoff'
  | 'blocked';

export interface ProjectInitiationDraft {
  id: string;
  current_step: number; // 1 to 8
  
  // Step 1: Client
  client_id?: string;
  client: Partial<Client>;

  // Step 2: Overview
  project_name: string;
  project_code: string;
  project_type: ProjectType;
  summary: string;
  business_problem: string;
  main_objectives: string;
  target_audience: string;
  target_platforms: string[];
  priority: PriorityLevel;
  project_manager_id?: string;
  team_member_ids: string[];
  start_date: string;
  target_delivery_date: string;
  confidentiality_level: ConfidentialityLevel;
  assumptions_constraints_risks: string;

  // Step 3: Requirements
  requirements: ProjectRequirement[];
  project_type_answers?: Record<string, any>;

  // Step 4: Technical
  technical_specs: ProjectTechnicalSpecs;

  // Step 5: Commercial
  commercial: ProjectCommercialDetails;

  // Step 6: Documents & SRS
  documents: ProjectDocument[];
  srs: SRSDocument;

  // Step 7: Readiness & Approval
  readiness_status: ReadinessState;
  readiness_checks: Record<string, boolean>;
  approval_status: 'pending' | 'changes_requested' | 'approved';
  approval_comments?: string;
  approved_by?: string;
  approved_at?: string;

  // Step 8: Kickoff
  is_kicked_off: boolean;
  kicked_off_at?: string;
  kicked_off_project_id?: string;
  kickoff_meeting_date?: string;

  created_at: string;
  updated_at: string;
}


