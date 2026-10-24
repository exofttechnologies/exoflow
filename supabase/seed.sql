-- ==============================================================================
-- Exoft Flow: Idempotent Seed Data Script
-- Populates 7 team members, 4 projects, 15 tasks, 3 meetings, 3 weekly reports
-- ==============================================================================

-- 1. Profiles (7 initial team members: 2 Admins, 5 Employees)
INSERT INTO public.profiles (id, email, full_name, role, avatar_url, designation, department, phone, status)
VALUES
('11111111-1111-4111-8111-111111111111', 'alex@exoft.tech', 'Alex Vance', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'CEO & Co-Founder', 'Executive Management', '+1 (555) 019-2831', 'active'),
('22222222-2222-4222-8222-222222222222', 'elena@exoft.tech', 'Elena Rostova', 'admin', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'COO & Co-Founder', 'Operations & Strategy', '+1 (555) 019-4822', 'active'),
('33333333-3333-4333-8333-333333333333', 'liam@exoft.tech', 'Liam Patel', 'employee', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Senior Frontend Engineer', 'Engineering', '+1 (555) 019-7744', 'active'),
('44444444-4444-4444-8444-444444444444', 'sarah@exoft.tech', 'Sarah Chen', 'employee', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Full Stack Developer', 'Engineering', '+1 (555) 019-5561', 'active'),
('55555555-5555-4555-8555-555555555555', 'marcus@exoft.tech', 'Marcus Brody', 'employee', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Backend & DevOps Engineer', 'Infrastructure', '+1 (555) 019-3329', 'active'),
('66666666-6666-4666-8666-666666666666', 'anya@exoft.tech', 'Anya Sharma', 'employee', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Lead UI/UX Designer', 'Product & Design', '+1 (555) 019-8812', 'active'),
('77777777-7777-4777-8777-777777777777', 'david@exoft.tech', 'David Kim', 'employee', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'QA Automation Engineer', 'Quality Assurance', '+1 (555) 019-9923', 'active')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  designation = EXCLUDED.designation,
  department = EXCLUDED.department,
  avatar_url = EXCLUDED.avatar_url;

-- 2. Projects (4 initial projects)
INSERT INTO public.projects (id, name, description, client_name, project_manager_id, start_date, deadline, priority, status, progress, created_by)
VALUES
('a1000000-0000-4000-8000-000000000001', 'Company Website', 'Corporate website redesign with dynamic animations, modern branding, and lead capture workflows.', 'Internal (Exoft)', '11111111-1111-4111-8111-111111111111', '2026-09-01', '2026-11-15', 'high', 'active', 75, '11111111-1111-4111-8111-111111111111'),
('a2000000-0000-4000-8000-000000000002', 'Client E-commerce Platform', 'High-volume B2B/B2C marketplace with Stripe checkout, catalog management, and ERP sync.', 'Nexus Retail Inc.', '22222222-2222-4222-8222-222222222222', '2026-08-15', '2026-11-30', 'urgent', 'active', 60, '22222222-2222-4222-8222-222222222222'),
('a3000000-0000-4000-8000-000000000003', 'School Management App', 'Web & mobile platform for student attendance, grading books, and parent-teacher announcements.', 'Oakridge International Academy', '11111111-1111-4111-8111-111111111111', '2026-10-01', '2026-12-20', 'medium', 'active', 35, '11111111-1111-4111-8111-111111111111'),
('a4000000-0000-4000-8000-000000000004', 'Internal Management System', 'Exoft Flow development: company workspace for tracking tasks, projects, Tuesday reviews, and reports.', 'Internal (Exoft)', '22222222-2222-4222-8222-222222222222', '2026-09-15', '2026-10-31', 'high', 'active', 85, '22222222-2222-4222-8222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- 3. Project Members
INSERT INTO public.project_members (project_id, user_id, role_in_project)
VALUES
('a1000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'manager'),
('a1000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', 'lead_frontend'),
('a1000000-0000-4000-8000-000000000001', '66666666-6666-4666-8666-666666666666', 'designer'),
('a2000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'manager'),
('a2000000-0000-4000-8000-000000000002', '44444444-4444-4444-8444-444444444444', 'developer'),
('a2000000-0000-4000-8000-000000000002', '55555555-5555-4555-8555-555555555555', 'devops'),
('a2000000-0000-4000-8000-000000000002', '77777777-7777-4777-8777-777777777777', 'qa')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- 4. Tasks (15 distributed tasks)
INSERT INTO public.tasks (id, project_id, title, description, created_by, priority, status, progress, start_date, due_date, blocker_description)
VALUES
('b1000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 'Implement Interactive Hero Animation', 'Build smooth framer-motion interactive hero section with responsive gradient meshes.', '11111111-1111-4111-8111-111111111111', 'high', 'completed', 100, '2026-09-05', '2026-09-18', NULL),
('b2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000001', 'Design Dark Mode Color Palette & Tokens', 'Harmonize contrast ratios and export Tailwind color variables for brand assets.', '11111111-1111-4111-8111-111111111111', 'medium', 'completed', 100, '2026-09-10', '2026-09-22', NULL),
('b3000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000001', 'Lead Capture Form with CRM Webhook', 'Connect contact inquiries to HubSpot/Slack webhooks with rate limiting and bot defense.', '11111111-1111-4111-8111-111111111111', 'high', 'in_progress', 65, '2026-10-10', '2026-10-25', NULL),
('b4000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000001', 'Lighthouse Performance Optimization', 'Ensure 95+ score across mobile/desktop, compress modern avif/webp assets and defer scripts.', '11111111-1111-4111-8111-111111111111', 'low', 'todo', 0, '2026-10-25', '2026-11-05', NULL),

('b5000000-0000-4000-8000-000000000005', 'a2000000-0000-4000-8000-000000000002', 'Stripe Payment Gateway Integration', 'Implement multi-currency checkout, webhooks for failed intents, and invoice email generation.', '22222222-2222-4222-8222-222222222222', 'urgent', 'in_progress', 70, '2026-10-01', '2026-10-22', NULL),
('b6000000-0000-4000-8000-000000000006', 'a2000000-0000-4000-8000-000000000002', 'Inventory Sync Blocker Resolution', 'Resolve deadlock on high-concurrency stock reservation during flash sale stress tests.', '22222222-2222-4222-8222-222222222222', 'urgent', 'blocked', 40, '2026-10-11', '2026-10-20', 'Awaiting client API documentation on their legacy SAP ERP inventory endpoint.'),
('b7000000-0000-4000-8000-000000000007', 'a2000000-0000-4000-8000-000000000002', 'Automated E2E Checkout Test Suite', 'Write Playwright test matrix covering guest checkout, 3D secure verification, and coupon codes.', '22222222-2222-4222-8222-222222222222', 'high', 'in_review', 90, '2026-10-05', '2026-10-19', NULL),
('b8000000-0000-4000-8000-000000000008', 'a2000000-0000-4000-8000-000000000002', 'Customer Review & Rating System', 'Allow verified purchasers to upload photos, vote on helpfulness, and filter reviews.', '22222222-2222-4222-8222-222222222222', 'medium', 'todo', 0, '2026-10-24', '2026-11-10', NULL),

('b9000000-0000-4000-8000-000000000009', 'a3000000-0000-4000-8000-000000000003', 'Attendance Tracking Module UI', 'Build fast QR code scanning and bulk attendance grid for teachers with offline mode support.', '11111111-1111-4111-8111-111111111111', 'high', 'in_progress', 55, '2026-10-05', '2026-10-26', NULL),
('ba000000-0000-4000-8000-000000000010', 'a3000000-0000-4000-8000-000000000003', 'Gradebook & Report Card PDF Generator', 'Generate standardized term report cards with custom school letterhead and GPA calculations.', '11111111-1111-4111-8111-111111111111', 'medium', 'todo', 15, '2026-10-15', '2026-11-12', NULL),
('bb000000-0000-4000-8000-000000000011', 'a3000000-0000-4000-8000-000000000003', 'Parent Push Notification Service', 'Broadcast instant emergency, exam schedule, and bus route alerts to parent iOS/Android devices.', '11111111-1111-4111-8111-111111111111', 'medium', 'todo', 0, '2026-11-01', '2026-11-28', NULL),

('bc000000-0000-4000-8000-000000000012', 'a4000000-0000-4000-8000-000000000004', 'Role-Based Authentication & Permissions', 'Configure Admin vs Employee roles, protect routes, and implement Supabase RLS security policies.', '22222222-2222-4222-8222-222222222222', 'urgent', 'completed', 100, '2026-09-18', '2026-10-02', NULL),
('bd000000-0000-4000-8000-000000000013', 'a4000000-0000-4000-8000-000000000004', 'Tuesday Progress Review Module & Action Items', 'Build agenda tracker, live minutes capture, blocker resolution panel, and action item assignments.', '22222222-2222-4222-8222-222222222222', 'high', 'in_progress', 80, '2026-10-04', '2026-10-21', NULL),
('be000000-0000-4000-8000-000000000014', 'a4000000-0000-4000-8000-000000000004', 'Weekly Report Submission & Admin Feedback Flow', 'Enable weekly report drafting, submission checks, Friday alerts, and Admin review with feedback.', '22222222-2222-4222-8222-222222222222', 'high', 'in_review', 95, '2026-10-08', '2026-10-23', NULL),
('bf000000-0000-4000-8000-000000000015', 'a4000000-0000-4000-8000-000000000004', 'Analytics Dashboard Charts with Recharts', 'Display project completion, task distributions, overdue metrics, and workload balances.', '11111111-1111-4111-8111-111111111111', 'medium', 'in_progress', 60, '2026-10-12', '2026-10-25', NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. Task Assignees
INSERT INTO public.task_assignees (task_id, user_id)
VALUES
('b1000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333'),
('b2000000-0000-4000-8000-000000000002', '66666666-6666-4666-8666-666666666666'),
('b3000000-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333'),
('b4000000-0000-4000-8000-000000000004', '77777777-7777-4777-8777-777777777777'),
('b5000000-0000-4000-8000-000000000005', '44444444-4444-4444-8444-444444444444'),
('b6000000-0000-4000-8000-000000000006', '55555555-5555-4555-8555-555555555555'),
('b7000000-0000-4000-8000-000000000007', '77777777-7777-4777-8777-777777777777'),
('b8000000-0000-4000-8000-000000000008', '44444444-4444-4444-8444-444444444444'),
('b9000000-0000-4000-8000-000000000009', '33333333-3333-4333-8333-333333333333'),
('ba000000-0000-4000-8000-000000000010', '44444444-4444-4444-8444-444444444444'),
('bb000000-0000-4000-8000-000000000011', '55555555-5555-4555-8555-555555555555'),
('bc000000-0000-4000-8000-000000000012', '44444444-4444-4444-8444-444444444444'),
('bd000000-0000-4000-8000-000000000013', '33333333-3333-4333-8333-333333333333'),
('be000000-0000-4000-8000-000000000014', '44444444-4444-4444-8444-444444444444'),
('bf000000-0000-4000-8000-000000000015', '33333333-3333-4333-8333-333333333333')
ON CONFLICT (task_id, user_id) DO NOTHING;

-- 6. Meetings (3 sample meetings)
INSERT INTO public.meetings (id, title, description, start_time, end_time, creator_id, project_id, agenda, meeting_type, recurrence, status, minutes, decisions, blockers)
VALUES
('c1000000-0000-4000-8000-000000000001', 'Weekly Tuesday Progress Review', 'Mandatory company-wide sync to evaluate weekly milestones, resolve blockers, and assign action items.', '2026-10-20 10:00:00+00', '2026-10-20 11:00:00+00', '11111111-1111-4111-8111-111111111111', 'a4000000-0000-4000-8000-000000000004', '1. Review project velocity across 4 active streams\n2. Discuss SAP ERP inventory blocker with Marcus\n3. Finalize Q4 milestone deadlines\n4. Assign Tuesday action items', 'weekly_tuesday', 'weekly_tuesday', 'scheduled', 'Previous meeting: All active sprints verified on track. Anya shared updated UI designs for School app.', 'Adopted standard Tuesday action item tracking with 48h turnaround for blockers.', 'Client API specification for Nexus Retail inventory sync delayed by 3 business days.'),
('c2000000-0000-4000-8000-000000000002', 'Project Planning & Architecture Sync', 'Technical sync between engineering leads to review caching strategy and database indexing.', '2026-10-22 14:00:00+00', '2026-10-22 15:00:00+00', '22222222-2222-4222-8222-222222222222', 'a2000000-0000-4000-8000-000000000002', '1. Review database schema indexing for 10M record stress test\n2. Caching layer with Redis vs Edge Cache\n3. Action items & milestones', 'planning', 'none', 'scheduled', NULL, NULL, NULL),
('c3000000-0000-4000-8000-000000000003', 'Client Project Review - Nexus E-commerce', 'Bi-weekly demo meeting with client stakeholders showcasing completed Stripe checkout and catalog UI.', '2026-10-24 16:00:00+00', '2026-10-24 17:00:00+00', '11111111-1111-4111-8111-111111111111', 'a2000000-0000-4000-8000-000000000002', '1. Live staging demo of multi-currency cart & checkout\n2. Admin product catalog management overview\n3. Client Q&A and launch checklist review', 'client_review', 'biweekly', 'scheduled', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 7. Meeting Action Items
INSERT INTO public.meeting_action_items (id, meeting_id, assignee_id, title, description, due_date, status)
VALUES
('c1100000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001', '55555555-5555-4555-8555-555555555555', 'Follow up with Nexus Retail tech lead regarding SAP API credentials', NULL, '2026-10-21', 'in_progress'),
('c1200000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001', '66666666-6666-4666-8666-666666666666', 'Provide exportable Figma components for School Management attendance view', NULL, '2026-10-22', 'pending')
ON CONFLICT (id) DO NOTHING;

-- 8. Weekly Reports (3 realistic samples)
INSERT INTO public.weekly_reports (id, user_id, reporting_week_start, tasks_completed, work_in_progress, pending_tasks, blockers, next_week_plan, additional_notes, status, admin_feedback, reviewed_by, reviewed_at)
VALUES
('d1000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', '2026-10-12', '• Built and finalized the interactive Hero section for Company Website.\n• Tested responsive animation performance across mobile devices.', '• Lead capture webhook integration with CRM.\n• Attendance scanning UI for School Management App.', '• Performance audit on Company Website.', 'None at this time.', '• Finish webhook testing and deploy to staging.\n• Implement offline mode for attendance scanner.', 'Hero animations running at steady 60fps on tested devices.', 'reviewed', 'Outstanding work on the hero animations, Liam! The polish is immediately noticeable.', '11111111-1111-4111-8111-111111111111', '2026-10-16 17:00:00+00'),
('d2000000-0000-4000-8000-000000000002', '44444444-4444-4444-8444-444444444444', '2026-10-12', '• Implemented Stripe checkout session endpoints with 3DS verification.\n• Fixed webhooks signature verification for customer payment events.', '• Integrating invoice generation upon successful payment intent.', '• Customer review and rating schema.', 'Awaiting updated test credentials from Nexus Retail for their live webhook listener.', '• Complete invoice PDF generation and attach to confirmation email.\n• Assist Marcus with database query plans.', 'All unit tests for Stripe payment webhooks passing in CI.', 'submitted', NULL, NULL, NULL),
('d3000000-0000-4000-8000-000000000003', '77777777-7777-4777-8777-777777777777', '2026-10-12', '• Configured Playwright matrix for checkout flow.\n• Wrote smoke tests for user authentication and password reset.', '• Stress testing payment endpoints with synthetic transactions.', '• Mobile web test suite for Safari and Chrome on Android.', 'Need dedicated test tenant in Nexus Retail sandbox.', '• Finalize E2E tests and add to GitHub Actions workflow.', 'Looking for clarification on test coupon limits.', 'needs_revision', 'Please link specific test runs and clarify which sandboxes were blocked so Elena can unblock you with the client.', '22222222-2222-4222-8222-222222222222', '2026-10-17 11:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- 9. Notifications
INSERT INTO public.notifications (id, user_id, title, message, type, link, is_read)
VALUES
('e1000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', 'New Task Assigned', 'Alex Vance assigned you to "Implement Interactive Hero Animation" on Company Website.', 'task_assigned', '/tasks', true),
('e2000000-0000-4000-8000-000000000002', '33333333-3333-4333-8333-333333333333', 'Weekly Report Reviewed', 'Alex Vance reviewed your weekly progress report with positive feedback.', 'report_feedback', '/reports', false),
('e3000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'Upcoming Tuesday Review', 'Weekly Tuesday Progress Review is scheduled for Tuesday at 10:00 AM UTC.', 'meeting_reminder', '/meetings', false),
('e4000000-0000-4000-8000-000000000004', '55555555-5555-4555-8555-555555555555', 'Action Item Assigned', 'Elena Rostova assigned you: Follow up with Nexus Retail tech lead on SAP API.', 'meeting_action', '/meetings', false)
ON CONFLICT (id) DO NOTHING;
