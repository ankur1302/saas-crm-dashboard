# High-Performance CRM

A modern, high-performance SaaS CRM and Admin Dashboard built for speed, scalability, and essential business operations. Designed to handle large datasets seamlessly, this project demonstrates a production-ready architecture capable of managing 10,000+ records with instant feedback and optimized server-side rendering.

## Key Features

- **🚀 High-Performance Architecture**: Built with Next.js App Router and Server Components for optimal speed and SEO.
- **⚡ Fast Authentication**: Secure, low-latency authentication powered by Supabase Auth.
- **👥 Leads Management**: Full CRUD capabilities, advanced filtering, server-side pagination, and bulk delete operations—tested with 10k+ records.
- **📥 Data Import**: Seamless Excel (.xlsx) file import for bulk lead creation.
- **✅ Task Management**: Organize team tasks with priority levels, status tracking, and lead association.
- **📜 Activity Logs**: comprehensive audit trails and system logs to track user actions and system events.
- **🔔 Real-time Feedback**: Optimistic UI updates and toast notifications for a responsive user experience.
- **🛡️ Team & Roles**: Invite-based team management system with role-based access control.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons), Radix UI (Primitives)
- **Backend / Database**: Supabase (PostgreSQL), Server Actions
- **Auth**: Supabase Auth (SSR)
- **Utilities**: `date-fns`, `xlsx`, `clsx`, `tailwind-merge`
- **Hosting**: Vercel-ready

## Project Structure

```bash
src/
├── app/                  # Next.js App Router pages & layouts
│   ├── (auth)/           # Authentication routes (login)
│   ├── (dashboard)/      # Protected dashboard routes (leads, tasks, settings)
│   └── api/              # API routes (webhooks, etc.)
├── components/           # Reusable UI components
│   ├── layout/           # Sidebar, Header, etc.
│   ├── leads/            # Leads-specific components (tables, modals)
│   ├── tasks/            # Tasks-specific components
│   └── ...
├── lib/                  # Utilities & configurations
│   ├── supabase/         # Supabase client setup (server/client)
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A generic Supabase project (Free tier works perfectly)

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
3.  Copy the contents of `supabase/schema.sql` and run it to create tables, indexes, and RLS policies.
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
- Navigate to **Leads** and try sorting/filtering through 10,000 records.
- Use the **Import** button to upload a sample Excel sheet.
- Create a **Task** and assign it to a Lead.
- Check **Settings** to customize lead categories.

## Performance Notes

- **Server Components**: The majority of data fetching happens on the server, reducing client-side bundle size.
- **Database Indexing**: Composite indexes are used on `status`, `priority`, and `created_at` columns to ensure sub-100ms query times even with large datasets.
- **Pagination**: Offset-based pagination is implemented efficiently to handle deep page navigation.

## Deployment

1.  Push your code to a GitHub repository.
2.  Import the project into **Vercel**.
3.  Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.) in the Vercel Project Settings.
4.  Deploy! The app is optimized for Vercel's edge network and serverless functions.

---

**Note**: This project was built as a portfolio piece to demonstrate capability in building complex, data-intensive SaaS applications. It serves as a solid foundation for MVPs, internal admin tools, or custom CRM solutions.

## License

This project is licensed under the MIT License.
