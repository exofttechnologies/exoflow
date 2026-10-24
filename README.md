# Exoft Flow — Company Management System

> **Work together. Move forward.**  
> Modern internal company management workspace built for **Exoft Technologies**.

---

## 1. Project Overview

**Exoft Flow** is an internal workspace that enables Exoft Technologies to manage projects, employee tasks, weekly progress reports, meetings, deadlines, and team performance from one unified dashboard.

- **Brand:** Exoft Technologies
- **Product:** Exoft Flow
- **Tagline:** Work together. Move forward.
- **Initial Team:** 7 members (2 Administrators / Company Owners & 5 Employees)

---

## 2. Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **State Management:** Reactive local store with Supabase sync & persistence

---

## 3. Initial Team Members & Seed Data

### 7 Team Members
| Name | Role | Designation | Department | Email |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Vance** | **Admin (Owner)** | CEO & Co-Founder | Executive Management | `alex@exoft.tech` |
| **Elena Rostova** | **Admin (Owner)** | COO & Co-Founder | Operations & Strategy | `elena@exoft.tech` |
| **Liam Patel** | **Employee** | Senior Frontend Engineer | Engineering | `liam@exoft.tech` |
| **Sarah Chen** | **Employee** | Full Stack Developer | Engineering | `sarah@exoft.tech` |
| **Marcus Brody** | **Employee** | Backend & DevOps Engineer | Infrastructure | `marcus@exoft.tech` |
| **Anya Sharma** | **Employee** | Lead UI/UX Designer | Product & Design | `anya@exoft.tech` |
| **David Kim** | **Employee** | QA Automation Engineer | Quality Assurance | `david@exoft.tech` |

### 4 Sample Projects
1. **Company Website** (Active, 75% progress)
2. **Client E-commerce Platform** (Active, 60% progress)
3. **School Management App** (Active, 35% progress)
4. **Internal Management System** (Active, 85% progress)

### 15 Tasks
Distributed across team members with To Do, In Progress, Blocked, In Review, and Completed statuses, priorities, deadlines, and blocker descriptions.

### 3 Meetings & Tuesday Review
1. **Weekly Tuesday Progress Review** (Recurring Tuesday progress sync with live minutes, decisions, and action items)
2. **Project Planning & Architecture Sync**
3. **Client Project Review - Nexus E-commerce**

### 3 Weekly Reports
- **Liam Patel**: Reviewed by Alex Vance with positive commendation.
- **Sarah Chen**: Submitted for review.
- **David Kim**: Needs revision (clarification on sandbox access).

---

## 4. Key Modules & Features

1. **Login Page (`/login`)**:
   - Pixel-perfect design matching Exoft brand specifications.
   - Includes instant 1-click test role selectors (Admin Demo vs Employee Demo).
2. **Dashboard (`/dashboard`)**:
   - Role-specific dashboard views for Admin vs Employee.
   - Recharts visualisations for Project Completion and Task Status distribution.
   - Tasks requiring immediate attention (blocked or overdue).
3. **Tasks & My Tasks (`/tasks`, `/my-tasks`)**:
   - Interactive Kanban board and tabular list views.
   - Status updates, priority tagging, and blocker reporting.
4. **Projects (`/projects`)**:
   - Project cards and tables with dynamic progress bars and team allocations.
5. **Meetings (`/meetings`)**:
   - Dedicated workflow for Tuesday progress review, minutes recording, and action item tracking.
6. **Weekly Reports (`/reports`)**:
   - Standard Friday weekly report submission with executive review & feedback.
7. **Team Management (`/team`)**:
   - Member management, role toggle, workload overview, and status badges.
8. **Analytics (`/analytics`)**:
   - Project progress rates, task breakdown, and team workload balances.
9. **Notifications (`/notifications`)**:
   - Activity notifications with mark-as-read tracking.
10. **Settings (`/settings`)**:
    - Organization information, Supabase integration status, and security policies.

---

## 5. Running Locally

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 6. Supabase Database Migration & Seeding

Full PostgreSQL migrations with Row Level Security (RLS) are located in:
- `supabase/migrations/20261017000000_initial_schema.sql`
- `supabase/seed.sql`

To apply them to a remote Supabase project:
1. Open your project on [database.new](https://database.new) or your Supabase Dashboard.
2. Go to the **SQL Editor**.
3. Paste and run `supabase/migrations/20261017000000_initial_schema.sql`.
4. Paste and run `supabase/seed.sql`.
5. Copy your project URL and Anon key into `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
# exoflow
