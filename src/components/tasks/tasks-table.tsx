"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { Edit, Trash2, MoreHorizontal, Loader2, Calendar, User, CheckCircle2, Circle } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteTask } from "@/app/actions/tasks";
import { TaskFormModal } from "./task-form-modal";

type Task = {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: string;
    priority: string;
    lead_id: string | null;
    assigned_to: string | null;
    leads: {
        first_name: string;
        last_name: string | null;
    } | null;
};

export function TasksTable({ tasks, leads = [] }: { tasks: Task[], leads?: any[] }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!confirm("Delete this task?")) return;
        startTransition(async () => {
            await deleteTask(id);
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-6"></th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Task</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Assigned</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500 text-sm">
                                    No tasks found.
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-4 py-2 text-zinc-400">
                                        {task.status === 'completed' ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Circle className="h-4 w-4" />
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="font-medium text-zinc-900 text-sm">{task.title}</div>
                                        {task.leads && (
                                            <div className="text-xs text-zinc-500 mt-0.5">
                                                Linked to: <span className="text-blue-600">{task.leads.first_name} {task.leads.last_name}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${task.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                            task.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                task.status === 'cancelled' ? 'bg-zinc-100 text-zinc-700 border-zinc-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>
                                            {task.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                                            task.priority === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                'bg-zinc-100 text-zinc-700 border-zinc-200'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-zinc-600 text-xs whitespace-nowrap">
                                        {task.due_date ? (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                                {format(new Date(task.due_date), "MMM d, yyyy")}
                                            </div>
                                        ) : "-"}
                                    </td>
                                    <td className="px-4 py-2 text-zinc-600 text-xs">
                                        {task.assigned_to ? (
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-zinc-400" />
                                                Me
                                            </div>
                                        ) : "-"}
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
                                                    <TaskFormModal initialData={task} leads={leads}>
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
