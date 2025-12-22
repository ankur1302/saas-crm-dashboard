import Link from "next/link";
import { ChevronRight, FileText, Tag, Users } from "lucide-react";

const items = [
    {
        name: "Lead Categories",
        description: "Manage categories used to classify leads.",
        href: "/settings/lead-categories",
        icon: Tag,
    },
    {
        name: "Log Categories",
        description: "Manage types of activity logs.",
        href: "/settings/log-categories",
        icon: FileText,
    },
    {
        name: "Team Management",
        description: "Invite members and manage roles.",
        href: "/settings/team",
        icon: Users,
    },
];

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Settings
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-300 transition-all"
                    >
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-zinc-100 p-2 group-hover:bg-zinc-200 transition-colors">
                                    <item.icon className="h-5 w-5 text-zinc-900" />
                                </div>
                                <h3 className="font-semibold text-zinc-900">
                                    {item.name}
                                </h3>
                            </div>
                            <p className="mt-2 text-sm text-zinc-500">
                                {item.description}
                            </p>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity">
                            Manage <ChevronRight className="ml-1 h-4 w-4" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
