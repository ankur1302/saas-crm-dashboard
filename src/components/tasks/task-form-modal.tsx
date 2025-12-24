"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X, Calendar } from "lucide-react";
import { createTask, updateTask } from "@/app/actions/tasks";

type Task = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    due_date: string | null;
    assigned_to: string;
};

export function TaskFormModal({
    children,
    initialData,
}: {
    children: React.ReactNode;
    initialData?: Task;
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
            let result;
            if (initialData) {
                result = await updateTask(initialData.id, formData);
            } else {
                result = await createTask(formData);
            }

            if (!result.success && result.error) {
                setError(result.error);
                return;
            }
            
            setOpen(false);
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl focus:outline-none z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                        <Dialog.Title className="text-xl font-semibold text-zinc-900">
                            {initialData ? "Edit Task" : "Create New Task"}
                        </Dialog.Title>
                        <Dialog.Close className="rounded-full p-2 hover:bg-zinc-200/50 text-zinc-400 hover:text-zinc-600 transition-all duration-200">
                            <X className="h-5 w-5" />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-5">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center shadow-sm">
                                    <span className="bg-red-100 p-1 rounded-full mr-2">
                                        <X className="w-3 h-3" />
                                    </span>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label htmlFor="title" className="text-sm font-medium text-zinc-700">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    required
                                    defaultValue={initialData?.title}
                                    className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-400"
                                    placeholder="e.g. Follow up with Acme Corp"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="description" className="text-sm font-medium text-zinc-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={initialData?.description || ""}
                                    rows={3}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-400 resize-none"
                                    placeholder="Add task details..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="status" className="text-sm font-medium text-zinc-700">
                                        Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="status"
                                            name="status"
                                            defaultValue={initialData?.status || "pending"}
                                            className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="priority" className="text-sm font-medium text-zinc-700">
                                        Priority
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="priority"
                                            name="priority"
                                            defaultValue={initialData?.priority || "medium"}
                                            className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="due_date" className="text-sm font-medium text-zinc-700">
                                    Due Date
                                </label>
                                <div className="relative">
                                    <input
                                        id="due_date"
                                        name="due_date"
                                        type="date"
                                        defaultValue={initialData?.due_date || ""}
                                        className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-400"
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="h-10 px-5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 bg-white hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="h-10 px-6 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center"
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
