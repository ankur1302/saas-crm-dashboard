
import { createClient } from "@/lib/supabase/server";
import { LogsTable } from "@/components/logs/logs-table";
import { LogsPagination } from "@/components/logs/logs-pagination";
import { LogsFilters } from "@/components/logs/logs-filters";
import { LogFormModal } from "@/components/logs/log-form-modal";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LogsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const PAGE_SIZE = 10;

    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const query = params?.query?.toString() || "";

    // Fetch recent leads for the create modal dropdown
    const { data: recentLeads } = await supabase
        .from("leads")
        .select("id, first_name, last_name")
        .order("created_at", { ascending: false })
        .limit(50);

    let dbQuery = supabase
        .from("logs")
        .select("*, leads(first_name, last_name)", { count: "exact" });

    if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,details.ilike.%${query}%`);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: logs, count } = await dbQuery
        .order("occurred_at", { ascending: false })
        .range(from, to);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Logs
                </h1>
                <LogFormModal leads={recentLeads || []}>
                    <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Log
                    </button>
                </LogFormModal>
            </div>

            <div className="flex items-center justify-between">
                <LogsFilters />
            </div>

            <LogsTable logs={logs as any || []} />

            <LogsPagination count={count || 0} pageSize={PAGE_SIZE} />
        </div>
    );
}
