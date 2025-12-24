# High-Performance CRM

A modern, high-performance SaaS CRM and Admin Dashboard built for speed, scalability, and essential business operations. Designed to handle large datasets seamlessly, this project demonstrates a production-ready architecture capable of managing 10,000+ records with instant feedback and optimized server-side rendering.

## Key Features

- **🚀 High-Performance Architecture**: Built with Next.js App Router and Server Components for optimal speed and SEO.
- **⚡ Fast Authentication**: Secure, low-latency authentication powered by Supabase Auth with automatic redirects.
- **👥 Leads Management**: Full CRUD capabilities, advanced filtering, server-side pagination, and bulk delete operations—tested with 10k+ records.
- **📥 Data Import**: Seamless Excel (.xlsx) file import for bulk lead creation.
- **✅ Task Management**: Organize team tasks with priority levels, status tracking, due dates, and advanced filtering.
- **📜 Automatic Activity Logs**: Comprehensive audit trails that automatically track all CRUD operations on tasks and leads—completely hands-free.
- **🔔 Real-time Feedback**: Optimistic UI updates and toast notifications for a responsive user experience.
- **🛡️ Team & Roles**: Invite-based team management system with role-based access control.
- **🎨 Premium UI/UX**: Modern, polished interface with smooth animations and intuitive navigation.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons), Radix UI (Primitives)
- **Backend / Database**: Supabase (PostgreSQL), Server Actions
- **Auth**: Supabase Auth (SSR) with Row Level Security (RLS)
- **Utilities**: `date-fns`, `xlsx`, `clsx`, `tailwind-merge`, `use-debounce`
- **Hosting**: Vercel-ready

## Project Structure

```bash
src/
├── app/                  # Next.js App Router pages & layouts
│   ├── (auth)/           # Authentication routes (login)
│   ├── (dashboard)/      # Protected dashboard routes
│   │   ├── dashboard/    # Main dashboard with stats
│   │   ├── leads/        # Leads management
│   │   ├── tasks/        # Task management
│   │   ├── logs/         # Activity logs (read-only)
│   │   └── settings/     # App settings
│   ├── actions/          # Server actions for CRUD operations
│   └── api/              # API routes (webhooks, etc.)
├── components/           # Reusable UI components
│   ├── layout/           # Sidebar, Header, etc.
│   ├── leads/            # Leads-specific components (tables, modals, filters)
│   ├── tasks/            # Tasks-specific components
│   ├── logs/             # Logs-specific components
│   └── ...
├── lib/                  # Utilities & configurations
│   ├── supabase/         # Supabase client setup (server/client)
│   ├── logger.ts         # Automatic logging utility
│   ├── webhook.ts        # Webhook integration
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (Free tier works perfectly)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/saas-crm-dashboard.git
    cd saas-crm-dashboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file in the root directory:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_seeding
    WEBHOOK_URL=optional_webhook_url
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Setup (Supabase)

1.  Create a new Supabase project.
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Run the following SQL files in order:
    - `supabase/schema.sql` - Creates base tables, indexes, and RLS policies
    - `supabase/migrations/tasks.sql` - Creates tasks table with RLS
    - `supabase/migrations/logs_update.sql` - Updates logs table for automatic system logging
4.  (Optional) **Seed Data**:
    Run the seed script to generate 10,000 dummy leads for performance testing:
    ```bash
    npx tsx scripts/seed.ts
    ```

## Demo Instructions

**Login Credentials (Demo):**
- **Email**: `admin@crm.com`
- **Password**: `password123` (or Sign Up with a new account)

**What to Test:**
- Navigate to **Dashboard** and view real-time stats with recent leads and upcoming tasks.
- Go to **Leads** and try sorting/filtering through 10,000 records.
- Use the **Import** button to upload a sample Excel sheet.
- Create a **Task** with priority, status, and due date.
- Check **Activity Logs** to see automatic system-generated logs for all your actions.
- Try **Settings** to customize lead categories.

## New Features

### Automatic Activity Logging
Every CRUD operation (Create, Update, Delete) on **Tasks** and **Leads** is automatically logged to the Activity Logs. The logs are:
- **Completely automatic** - no manual intervention required
- **Read-only** - users cannot create, edit, or delete logs manually
- **Detailed** - includes user ID, entity type, action, and human-readable messages
- **Secure** - uses Row Level Security to ensure users only see their own logs

### Task Management
- Create tasks with title, description, status, priority, and due dates
- Filter tasks by status (Pending, In Progress, Done) and priority (Low, Medium, High, Urgent)
- Search tasks by title
- Edit and delete tasks with optimistic UI updates
- All task operations are automatically logged

### Enhanced Dashboard
- Real-time statistics for Leads, Tasks, and Logs
- Recent Leads section showing the 5 most recent entries
- Upcoming Tasks section showing pending/in-progress tasks sorted by due date
- Dynamic percentage changes for each metric

## Performance Notes

- **Server Components**: The majority of data fetching happens on the server, reducing client-side bundle size.
- **Database Indexing**: Composite indexes are used on `status`, `priority`, and `created_at` columns to ensure sub-100ms query times even with large datasets.
- **Pagination**: Offset-based pagination is implemented efficiently to handle deep page navigation.
- **Row Level Security**: All tables use RLS policies to ensure users only access their own data.
- **Optimistic Updates**: Delete operations use React transitions for instant UI feedback.

## Deployment

1.  Push your code to a GitHub repository.
2.  Import the project into **Vercel**.
3.  Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.) in the Vercel Project Settings.
4.  Deploy! The app is optimized for Vercel's edge network and serverless functions.

---

**Note**: This project was built as a portfolio piece to demonstrate capability in building complex, data-intensive SaaS applications. It serves as a solid foundation for MVPs, internal admin tools, or custom CRM solutions.

## License

This project is licensed under the MIT License.
