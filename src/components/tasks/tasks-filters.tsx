"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, Filter } from "lucide-react";

export function TasksFilters() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`?${params.toString()}`);
    }, 300);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        replace(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-3 bg-white p-4 border rounded-lg border-zinc-200 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                    className="h-9 w-full rounded border border-zinc-300 bg-white pl-9 pr-4 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search tasks..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("query")?.toString()}
                />
            </div>
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-zinc-500" />
                <select
                    className="h-9 rounded border border-zinc-300 bg-white px-3 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    defaultValue={searchParams.get("status")?.toString() || "all"}
                >
                    <option value="all">Status: All</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <select
                    className="h-9 rounded border border-zinc-300 bg-white px-3 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => handleFilterChange("priority", e.target.value)}
                    defaultValue={searchParams.get("priority")?.toString() || "all"}
                >
                    <option value="all">Priority: All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
        </div>
    );
}
