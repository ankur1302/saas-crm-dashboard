"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Shield, Mail, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type TeamMember = {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    created_at: string | null;
    status?: "active" | "invited";
};

export function MembersTable({
    members,
    invitations = [],
    userRole = "viewer"
}: {
    members: TeamMember[];
    invitations?: any[];
    userRole?: string;
}) {
    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {members.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-zinc-500 text-sm">
                                    No team members found.
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-4 py-2">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center mr-3 text-zinc-500">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-zinc-900 text-sm">
                                                    {member.full_name || "Unknown"}
                                                </div>
                                                <div className="text-zinc-500 text-xs flex items-center">
                                                    <Mail className="h-3 w-3 mr-1" /> {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center text-zinc-700 text-sm capitalize">
                                            <Shield className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                                            {member.role}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${member.status === 'invited' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-green-50 text-green-700 border-green-200'
                                            }`}>
                                            {member.status || "active"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-zinc-500 text-xs whitespace-nowrap">
                                        {member.created_at ? formatDistanceToNow(new Date(member.created_at), { addSuffix: true }) : "-"}
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
                                                    <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-zinc-50 text-zinc-700 outline-none">
                                                        Edit Role
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-red-50 text-red-600 outline-none">
                                                        Remove Member
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
