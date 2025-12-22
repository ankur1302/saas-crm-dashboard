"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { createTask, updateTask } from "@/app/actions/tasks";
import { format } from "date-fns";

type Task = {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: string;
    priority: string;
    lead_id: string | null;
    assigned_to: string | null;
};

export function TaskFormModal({
    children,
    initialData,
    leads = [],
}: {
    children: React.ReactNode;
    initialData?: Task;
    leads?: any[];
}) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            if (initialData) {
                await updateTask(initialData.id, formData);
            } else {
                await createTask(formData);
            }
            setOpen(false);
        } catch (err) {
            setError("Failed to save task. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-zinc-900">
                            {initialData ? "Edit Task" : "Create Task"}
                        </Dialog.Title>
                        <Dialog.Close className="rounded-full p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
                            <X className="h-4 w-4" />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-xs font-semibold text-zinc-700 mb-1">
                                Task Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                required
                                defaultValue={initialData?.title}
                                className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. Call John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-xs font-semibold text-zinc-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                defaultValue={initialData?.description || ""}
                                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                                placeholder="Add task details..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="due_date" className="block text-xs font-semibold text-zinc-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    id="due_date"
                                    name="due_date"
                                    type="date"
                                    defaultValue={initialData?.due_date ? format(new Date(initialData.due_date), "yyyy-MM-dd") : ""}
                                    className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="lead_id" className="block text-xs font-semibold text-zinc-700 mb-1">
                                    Related Lead
                                </label>
                                <select
                                    id="lead_id"
                                    name="lead_id"
                                    defaultValue={initialData?.lead_id || ""}
                                    className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="">No Lead</option>
                                    {leads.map((lead) => (
                                        <option key={lead.id} value={lead.id}>
                                            {lead.first_name} {lead.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block text-xs font-semibold text-zinc-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={initialData?.status || "pending"}
                                    className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="priority" className="block text-xs font-semibold text-zinc-700 mb-1">
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    defaultValue={initialData?.priority || "medium"}
                                    className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {initialData ? "Save Changes" : "Create Task"}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
