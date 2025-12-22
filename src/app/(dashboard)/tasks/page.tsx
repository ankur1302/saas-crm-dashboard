
import { createClient } from "@/lib/supabase/server";
import { TasksTable } from "@/components/tasks/tasks-table";
import { TaskFormModal } from "@/components/tasks/task-form-modal";
import { TasksFilters } from "@/components/tasks/tasks-filters";
import { TasksPagination } from "@/components/tasks/tasks-pagination";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TasksPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string; status?: string; priority?: string }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const query = params?.query || "";
    const currentPage = Number(params?.page) || 1;
    const status = params?.status || "all";
    const priority = params?.priority || "all";
    const itemsPerPage = 10;
    const offset = (currentPage - 1) * itemsPerPage;

    let dbQuery = supabase
        .from("tasks")
        .select("*, leads(first_name, last_name)", { count: "exact" });

    // Apply filters
    if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
    }

    if (status !== "all") {
        dbQuery = dbQuery.eq("status", status);
    }

    if (priority !== "all") {
        dbQuery = dbQuery.eq("priority", priority);
    }

    const { data: tasks, count } = await dbQuery
        .order("created_at", { ascending: false })
        .range(offset, offset + itemsPerPage - 1);

    const totalPages = Math.ceil((count || 0) / itemsPerPage);

    // Fetch recent leads for the create modal dropdown
    const { data: recentLeads } = await supabase
        .from("leads")
        .select("id, first_name, last_name")
        .order("created_at", { ascending: false })
        .limit(50);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Tasks
                </h1>
                <TaskFormModal leads={recentLeads || []}>
                    <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                    </button>
                </TaskFormModal>
            </div>

            <TasksFilters />

            <div className="rounded-md border border-zinc-200">
                <TasksTable tasks={tasks as any || []} leads={recentLeads || []} />
                <TasksPagination totalPages={totalPages} currentPage={currentPage} />
            </div>
        </div>
    );
}
