
import { createClient } from "@/lib/supabase/server";
import { LogCategoriesTable } from "@/components/settings/log-categories-table";
import { LogCategoryFormModal } from "@/components/settings/log-category-form-modal";
import { Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LogCategoriesPage() {
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from("log_categories")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 -ml-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Log Categories
                </h1>
            </div>

            <div className="flex justify-end">
                <LogCategoryFormModal>
                    <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Category
                    </button>
                </LogCategoryFormModal>
            </div>

            <LogCategoriesTable categories={categories || []} />
        </div>
    );
}
