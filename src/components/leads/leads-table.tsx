"use client";

import { useTransition, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Check, Edit, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteLead, deleteLeads } from "@/app/actions/leads";
import { LeadFormModal } from "./lead-form-modal";

type Lead = {
    id: string;
    first_name: string;
    last_name: string | null;
    company: string | null;
    email: string | null;
    phone?: string | null;
    status: string;
    priority: string;
    created_at: string;
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();

    const handleSelectAll = () => {
        if (selectedIds.size === leads.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(leads.map((l) => l.id)));
        }
    };

    const handleSelectOne = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = () => {
        if (!confirm("Are you sure you want to delete selected leads?")) return;
        startTransition(async () => {
            await deleteLeads(Array.from(selectedIds));
            setSelectedIds(new Set());
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        startTransition(async () => {
            await deleteLead(id);
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 border-b border-zinc-200 bg-blue-50 px-4 py-2">
                    <span className="text-xs font-medium text-blue-700">
                        {selectedIds.size} selected
                    </span>
                    <button
                        onClick={handleBulkDelete}
                        disabled={isPending}
                        className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        Delete Selected
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
                        <tr>
                            <th className="w-[40px] px-4 py-2">
                                <button
                                    onClick={handleSelectAll}
                                    className={`flex h-4 w-4 items-center justify-center rounded border ${selectedIds.size === leads.length && leads.length > 0 ? "bg-blue-600 border-blue-600 text-white" : "border-zinc-300 bg-white"}`}
                                >
                                    {selectedIds.size === leads.length && leads.length > 0 && <Check className="h-3 w-3" />}
                                </button>
                            </th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Company</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Created</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 bg-white">
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500 text-sm">
                                    No leads found.
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleSelectOne(lead.id)}
                                            className={`flex h-4 w-4 items-center justify-center rounded border ${selectedIds.has(lead.id) ? "bg-blue-600 border-blue-600 text-white" : "border-zinc-300 bg-white"}`}
                                        >
                                            {selectedIds.has(lead.id) && <Check className="h-3 w-3" />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="font-medium text-zinc-900 text-sm">
                                            {lead.first_name} {lead.last_name}
                                        </div>
                                        <div className="text-zinc-500 text-xs">{lead.email}</div>
                                    </td>
                                    <td className="px-4 py-2 text-zinc-700 text-sm">
                                        {lead.company || "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 capitalize">
                                            {lead.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${lead.priority === 'urgent' ? 'bg-red-50 text-red-700 border-red-200' :
                                            lead.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                'bg-zinc-100 text-zinc-700 border-zinc-200'
                                            }`}>
                                            {lead.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-zinc-500 text-xs whitespace-nowrap">
                                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
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
                                                    <LeadFormModal initialData={lead}>
                                                        <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-zinc-50 text-zinc-700 outline-none">
                                                            <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                                                            Edit
                                                        </DropdownMenu.Item>
                                                    </LeadFormModal>
                                                    <DropdownMenu.Item
                                                        onSelect={() => handleDelete(lead.id)}
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
