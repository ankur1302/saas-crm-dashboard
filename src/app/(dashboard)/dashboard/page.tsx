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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                        Last updated: Just now
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200/50"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                                    {stat.name}
                                </p>
                                <h3 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-200`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-slate-500">
                            <span className="text-emerald-600 font-medium flex items-center mr-2 bg-emerald-50 px-1.5 py-0.5 rounded">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +2.5%
                            </span>
                            <span>from last month</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">Recent Leads</h3>
                        <Link href="/leads" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                    </div>
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                            <Users className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-900">No leads found</h3>
                        <p className="mt-1 text-sm text-slate-500">Get started by creating a new lead.</p>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">Upcoming Tasks</h3>
                        <Link href="/tasks" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                    </div>
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                            <CheckSquare className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-900">No pending tasks</h3>
                        <p className="mt-1 text-sm text-slate-500">You're all caught up for today!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
