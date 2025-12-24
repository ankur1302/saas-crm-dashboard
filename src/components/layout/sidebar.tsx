"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    FileText,
    Settings,
    LogOut,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Logs", href: "/logs", icon: FileText }
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-slate-950 text-white shadow-xl border-r border-slate-800">
            <div className="flex h-16 items-center px-6 font-bold text-xl tracking-wide border-b border-slate-800/50">
                <span className="bg-gradient-to-br from-blue-400 to-blue-600 text-transparent bg-clip-text mr-2 text-2xl">♦</span>
                <span className="bg-gradient-to-r from-white to-slate-400 text-transparent bg-clip-text">CRM</span>
            </div>
            <nav className="flex-1 space-y-1.5 px-4 py-6">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-500"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-white hover:pl-4"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200",
                                    isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400 group-hover:scale-110"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-slate-800/50 p-4 bg-slate-950/50">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-slate-800 shadow-sm" />
                    <div className="text-xs">
                        <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">Admin User</p>
                        <p className="text-slate-500">admin@crm.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
