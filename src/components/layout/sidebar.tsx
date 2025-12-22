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
    { name: "Logs", href: "/logs", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-zinc-900 text-white shadow-xl">
            <div className="flex h-14 items-center px-6 font-bold text-lg tracking-wide border-b border-zinc-800">
                <span className="text-blue-500 mr-2">♦</span> CRM
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-zinc-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-700" />
                    <div className="text-xs">
                        <p className="font-medium text-white">Admin User</p>
                        <p className="text-zinc-400">admin@crm.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
