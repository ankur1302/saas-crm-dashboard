import { createClient } from "@/lib/supabase/server";
import { Users, CheckSquare, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch counts in parallel
    const [leads, tasks, logs] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("tasks").select("*", { count: "exact", head: true }).eq('status', 'pending'),
        supabase.from("logs").select("*", { count: "exact", head: true }),
    ]);

    const stats = [
        {
            name: "Total Leads",
            value: leads.count ?? 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: "/leads",
        },
        {
            name: "Pending Tasks",
            value: tasks.count ?? 0,
            icon: CheckSquare,
            color: "text-orange-600",
            bg: "bg-orange-50",
            href: "/tasks",
        },
        {
            name: "Activity Logs",
            value: logs.count ?? 0,
            icon: FileText,
            color: "text-purple-600",
            bg: "bg-purple-50",
            href: "/logs",
        },
        {
            name: "Conversion Rate",
            value: "12.5%",
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50",
            href: "#",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Dashboard Overview
                </h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">Last updated: Just now</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-zinc-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-500">
                                    {stat.name}
                                </p>
                                <h3 className="mt-2 text-3xl font-bold text-zinc-900 tracking-tight">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-zinc-500">
                            <span className="text-green-600 font-medium flex items-center mr-2">
                                +2.5%
                            </span>
                            <span>from last month</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
                    <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
                        <h3 className="text-sm font-semibold text-zinc-900">Recent Leads</h3>
                    </div>
                    <div className="p-6 text-center text-sm text-zinc-500">
                        No recent leads to display.
                    </div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
                    <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
                        <h3 className="text-sm font-semibold text-zinc-900">Upcoming Tasks</h3>
                    </div>
                    <div className="p-6 text-center text-sm text-zinc-500">
                        No upcoming tasks due specifically today.
                    </div>
                </div>
            </div>
        </div>
    );
}
