import { createClient } from "@/lib/supabase/server";
import { TasksTable } from "@/components/tasks/tasks-table";
import { TaskFormModal } from "@/components/tasks/task-form-modal";
import { TasksFilters } from "@/components/tasks/tasks-filters";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TasksPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const query = params?.query?.toString() || "";
    const status = params?.status?.toString();
    const priority = params?.priority?.toString();

    let dbQuery = supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

    if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
    }

    if (status && status !== "all") {
        dbQuery = dbQuery.eq("status", status);
    }

    if (priority && priority !== "all") {
        dbQuery = dbQuery.eq("priority", priority);
    }

    const { data: tasks } = await dbQuery;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Tasks
                </h1>
                <div className="flex gap-2">
                    <TaskFormModal>
                        <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Task
                        </button>
                    </TaskFormModal>
                </div>
            </div>

            <TasksFilters />

            <TasksTable tasks={tasks || []} />
        </div>
    );
}
