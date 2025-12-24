import { createClient } from "@/lib/supabase/server";
import { Users, CheckSquare, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch counts in parallel
    // Fetch counts and lists in parallel
    const [leadsCount, tasksCount, logsCount, recentLeads, upcomingTasks] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("tasks").select("*", { count: "exact", head: true }).in('status', ['pending', 'in_progress']),
        supabase.from("logs").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("tasks").select("*").in('status', ['pending', 'in_progress']).order("due_date", { ascending: true }).limit(5),
    ]);

    const stats = [
        {
            name: "Total Leads",
            value: leadsCount.count ?? 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: "/leads",
            percent: 12.5,
        },
        {
            name: "Pending Tasks",
            value: tasksCount.count ?? 0,
            icon: CheckSquare,
            color: "text-orange-600",
            bg: "bg-orange-50",
            href: "/tasks",
            percent: 2.5,
        },
        {
            name: "Activity Logs",
            value: logsCount.count ?? 0,
            icon: FileText,
            color: "text-purple-600",
            bg: "bg-purple-50",
            href: "/logs",
            percent: 10.5,
        },
        {
            name: "Conversion Rate",
            value: "12.5%",
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50",
            href: "#",
            percent: 8.5,
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
                                +{stat.percent}%
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
                    {recentLeads.data && recentLeads.data.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {recentLeads.data.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                                            {lead.first_name[0]}{lead.last_name ? lead.last_name[0] : ""}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{lead.first_name} {lead.last_name}</p>
                                            <p className="text-xs text-slate-500">{lead.company || lead.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                                        lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        lead.status === 'contacted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                        lead.status === 'qualified' ? 'bg-green-50 text-green-700 border-green-200' :
                                        'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}>
                                        {lead.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                                <Users className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-medium text-slate-900">No leads found</h3>
                            <p className="mt-1 text-sm text-slate-500">Get started by creating a new lead.</p>
                        </div>
                    )}
                </div>
                <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">Upcoming Tasks</h3>
                        <Link href="/tasks" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                    </div>
                    {upcomingTasks.data && upcomingTasks.data.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {upcomingTasks.data.map((task) => (
                                <div key={task.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${task.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            <CheckSquare className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{task.title}</p>
                                            <p className="text-xs text-slate-500">
                                                {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : "No due date"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                                        task.priority === 'urgent' ? 'bg-red-50 text-red-700 border-red-200' :
                                        task.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                                <CheckSquare className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-medium text-slate-900">No pending tasks</h3>
                            <p className="mt-1 text-sm text-slate-500">You're all caught up for today!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
