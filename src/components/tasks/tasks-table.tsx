"use client";

import { useTransition, useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Check, Edit, Trash2, MoreHorizontal, Loader2, Calendar } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteTask } from "@/app/actions/tasks";
import { TaskFormModal } from "./task-form-modal";

type Task = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    due_date: string | null;
    assigned_to: string;
    created_at: string;
};

export function TasksTable({ tasks }: { tasks: Task[] }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        startTransition(async () => {
            await deleteTask(id);
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'bg-green-50 text-green-700 border-green-200';
            case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-50 text-red-700 border-red-200';
            case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Created</th>
                            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 bg-white">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-zinc-500 text-sm">
                                    No tasks found. Create a new task to get started.
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-zinc-900 text-sm">
                                            {task.title}
                                        </div>
                                        {task.description && (
                                            <div className="text-zinc-500 text-xs truncate max-w-xs">{task.description}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${getStatusColor(task.status)}`}>
                                            {task.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600 text-xs">
                                        {task.due_date ? (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                                {format(new Date(task.due_date), "MMM d, yyyy")}
                                            </div>
                                        ) : (
                                            <span className="text-zinc-400 italic">No date</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                                        {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger asChild>
                                                <button className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content className="min-w-[140px] bg-white border border-zinc-200 rounded-md shadow-lg p-1 z-50">
                                                    <TaskFormModal initialData={task}>
                                                        <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-zinc-50 text-zinc-700 outline-none">
                                                            <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                                                            Edit
                                                        </DropdownMenu.Item>
                                                    </TaskFormModal>
                                                    <DropdownMenu.Item
                                                        onSelect={() => handleDelete(task.id)}
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
