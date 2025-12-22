"use client";

import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2, MoreHorizontal, Loader2, Info } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteLog } from "@/app/actions/logs";
import { LogFormModal } from "./log-form-modal";

type Log = {
    id: string;
    title: string;
    details: string | null;
    occurred_at: string;
    lead_id: string;
    leads: {
        first_name: string;
        last_name: string | null;
    } | null;
};

export function LogsTable({ logs }: { logs: Log[] }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!confirm("Delete this log?")) return;
        startTransition(async () => {
            await deleteLog(id);
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-6"></th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Lead</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-zinc-500 text-sm">
                                    No logs found.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-4 py-2 text-zinc-400">
                                        <Info className="h-4 w-4" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="font-medium text-zinc-900 text-sm">{log.title}</div>
                                        {log.details && (
                                            <p className="text-xs text-zinc-500 truncate max-w-[300px] mt-0.5">{log.details}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-zinc-600 text-sm">
                                        {log.leads ? <span className="text-blue-600">{log.leads.first_name} {log.leads.last_name || ""}</span> : "Unknown"}
                                    </td>
                                    <td className="px-4 py-2 text-zinc-500 text-xs whitespace-nowrap">
                                        {formatDistanceToNow(new Date(log.occurred_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger asChild>
                                                <button className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content className="min-w-[140px] bg-white border border-zinc-200 rounded-md shadow-lg p-1 z-50">
                                                    <LogFormModal initialData={log}>
                                                        <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-zinc-50 text-zinc-700 outline-none">
                                                            <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                                                            Edit
                                                        </DropdownMenu.Item>
                                                    </LogFormModal>
                                                    <DropdownMenu.Item
                                                        onSelect={() => handleDelete(log.id)}
                                                        disabled={isPending}
                                                        className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-red-50 text-red-600 outline-none"
                                                    >
                                                        {isPending ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-2 h-3.5 w-3.5" />}
                                                        Delete
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
