
import { createClient } from "@/lib/supabase/server";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadsPagination } from "@/components/leads/leads-pagination";
import { LeadsFilters } from "@/components/leads/leads-filters";
import { LeadFormModal } from "@/components/leads/lead-form-modal";
import { LeadImportModal } from "@/components/leads/lead-import-modal";
import { Plus, Upload } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const PAGE_SIZE = 10;

    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const query = params?.query?.toString() || "";
    const status = params?.status?.toString();
    const priority = params?.priority?.toString();

    let dbQuery = supabase
        .from("leads")
        .select("id, first_name, last_name, company, email, status, priority, created_at", { count: "exact" });

    // Filters
    if (query) {
        dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,company.ilike.%${query}%,email.ilike.%${query}%`);
    }

    if (status && status !== "all") {
        dbQuery = dbQuery.eq("status", status);
    }

    if (priority && priority !== "all") {
        dbQuery = dbQuery.eq("priority", priority);
    }

    // Pagination
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: leads, count } = await dbQuery
        .order("created_at", { ascending: false })
        .range(from, to);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Leads
                </h1>
                <div className="flex gap-2">
                    <LeadImportModal>
                        <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2">
                            <Upload className="mr-2 h-4 w-4" />
                            Import
                        </button>
                    </LeadImportModal>
                    <LeadFormModal>
                        <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Lead
                        </button>
                    </LeadFormModal>
                </div>
            </div>

            <LeadsFilters />

            <LeadsTable leads={leads || []} />

            <LeadsPagination count={count || 0} pageSize={PAGE_SIZE} />
        </div>
    );
}
