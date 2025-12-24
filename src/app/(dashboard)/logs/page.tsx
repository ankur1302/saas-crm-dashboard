
import { createClient } from "@/lib/supabase/server";
import { LogsTable } from "@/components/logs/logs-table";
import { LogsPagination } from "@/components/logs/logs-pagination";
import { LogsFilters } from "@/components/logs/logs-filters";

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
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                        Activity Logs
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Automatically generated system activity logs
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <LogsFilters />
            </div>

            <LogsTable logs={logs as any || []} />

            <LogsPagination count={count || 0} pageSize={PAGE_SIZE} />
        </div>
    );
}
